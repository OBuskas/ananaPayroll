const { expect } = require("chai");

describe("EmployeeRegistry", function () {
  it("should add, accept and terminate an employee", async function () {
    const [admin, employee] = await ethers.getSigners();

    const CompanyRegistry = await ethers.getContractFactory("CompanyRegistry");
    const companyRegistry = await CompanyRegistry.deploy();
    await companyRegistry.waitForDeployment();

    const EmployeeRegistry = await ethers.getContractFactory("EmployeeRegistry");
    const employeeRegistry = await EmployeeRegistry.deploy(companyRegistry.target);
    await employeeRegistry.waitForDeployment();

    await (await companyRegistry.registerCompany("Acme Inc.")).wait();

    await (
      await employeeRegistry.addEmployee(
        0,
        employee.address,
        1000,
        2592000,
        604800
      )
    ).wait();

    let record = await employeeRegistry.getEmployee(0, employee.address);
    expect(record.exists).to.equal(true);
    expect(record.active).to.equal(true);
    expect(record.accepted).to.equal(false);

    // Accept job
    await (await employeeRegistry.connect(employee).acceptJob(0)).wait();

    record = await employeeRegistry.getEmployee(0, employee.address);
    expect(record.accepted).to.equal(true);

    // Terminate employee
    await (await employeeRegistry.terminateEmployee(0, employee.address)).wait();

    record = await employeeRegistry.getEmployee(0, employee.address);
    expect(record.active).to.equal(false);

    // Cannot accept again → should revert with Already accepted (order of checks)
    await expect(
      employeeRegistry.connect(employee).acceptJob(0)
    ).to.be.revertedWith("Already accepted");
  });
});
