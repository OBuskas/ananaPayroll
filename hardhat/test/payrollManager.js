const { expect } = require("chai");

describe("PayrollManager", function () {
  let usdt, vault, registry, employees, manager;
  let admin, emp1, emp2;

  beforeEach(async function () {
    [admin, emp1, emp2] = await ethers.getSigners();

    const CompanyRegistry = await ethers.getContractFactory("CompanyRegistry");
    registry = await CompanyRegistry.deploy();
    await registry.waitForDeployment();

    const EmployeeRegistry = await ethers.getContractFactory("EmployeeRegistry");
    employees = await EmployeeRegistry.deploy(registry.target);
    await employees.waitForDeployment();

    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();

    const PaymentVault = await ethers.getContractFactory("PaymentVault");
    vault = await PaymentVault.deploy(usdt.target);
    await vault.waitForDeployment();

    const PayrollManager = await ethers.getContractFactory("PayrollManager");
    manager = await PayrollManager.deploy(
      registry.target,
      employees.target,
      vault.target
    );
    await manager.waitForDeployment();

    await vault.setPayrollManager(manager.target);

    await registry.registerCompany("Acme");

    await employees.addEmployee(0, emp1.address, 500000, 2592000, 10);
    await employees.addEmployee(0, emp2.address, 700000, 2592000, 10);

    await employees.connect(emp1).acceptJob(0);
    await employees.connect(emp2).acceptJob(0);

    await usdt.transfer(vault.target, 2_000_000n);
  });

  it("should create payroll run and generate payments", async function () {
    await (await manager.createPayrollRun(0, [
      emp1.address,
      emp2.address
    ])).wait();

    const p1 = await vault.payments(0);
    const p2 = await vault.payments(1);

    expect(p1.employee).to.equal(emp1.address);
    expect(p1.amount).to.equal(500000);

    expect(p2.employee).to.equal(emp2.address);
    expect(p2.amount).to.equal(700000);
  });

  it("should ignore terminated employees", async function () {
    await (await employees.terminateEmployee(0, emp2.address)).wait();

    await (await manager.createPayrollRun(0, [
      emp1.address,
      emp2.address
    ])).wait();

    const p0 = await vault.payments(0);
    expect(p0.employee).to.equal(emp1.address);

    // Payment #1 should not exist → all fields are defaults (zeroed)
    const p1 = await vault.payments(1);
    expect(p1.employee).to.equal("0x0000000000000000000000000000000000000000");
    expect(p1.amount).to.equal(0);
  });
});
