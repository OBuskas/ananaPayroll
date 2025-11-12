const { expect } = require("chai");

describe("PaymentVault", function () {
  let usdt, vault, payrollManager;
  let admin, company, employee, relayer;

  beforeEach(async function () {
    [admin, company, employee, relayer] = await ethers.getSigners();

    // Deploy Mock USDT
    const MockUSDT = await ethers.getContractFactory("MockUSDT");
    usdt = await MockUSDT.deploy();
    await usdt.waitForDeployment();

    // Deploy PaymentVault
    const PaymentVault = await ethers.getContractFactory("PaymentVault");
    vault = await PaymentVault.deploy(usdt.target);
    await vault.waitForDeployment();

    // Set payroll manager (simulated)
    payrollManager = admin.address;
    await vault.setPayrollManager(payrollManager);

    // Fund the vault with USDT
    await usdt.transfer(vault.target, 1_000_000n); // 1 USDT = 1e6 units
  });

  it("should create a payment", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const release = now + 1000;

    const tx = await vault
      .connect(admin)
      .createPayment(company.address, employee.address, 500_000, release);

    await tx.wait();

    const payment = await vault.payments(0);

    expect(payment.amount).to.equal(500_000);
    expect(payment.employee).to.equal(employee.address);
    expect(payment.company).to.equal(company.address);
    expect(payment.releaseAt).to.equal(release);
    expect(payment.claimed).to.equal(false);
  });

  it("should allow direct claim by employee after release time", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const release = now + 2;

    // Create payment
    await vault
      .connect(admin)
      .createPayment(company.address, employee.address, 300_000, release);

    // Wait 2 seconds
    await network.provider.send("evm_increaseTime", [3]);
    await network.provider.send("evm_mine");

    // Claim
    const beforeBalance = await usdt.balanceOf(employee.address);

    const tx = await vault.connect(employee).claim(0);
    await tx.wait();

    const afterBalance = await usdt.balanceOf(employee.address);

    expect(afterBalance - beforeBalance).to.equal(300_000);

    const payment = await vault.payments(0);
    expect(payment.claimed).to.equal(true);
  });

  it("should NOT allow claim before release time", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const release = now + 1000;

    await vault
      .connect(admin)
      .createPayment(company.address, employee.address, 100_000, release);

    await expect(vault.connect(employee).claim(0)).to.be.revertedWith(
      "Locked"
    );
  });

  it("should allow claimFor by payroll manager (relayer)", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const release = now + 2;

    // Create payment
    await vault
      .connect(admin)
      .createPayment(company.address, employee.address, 200_000, release);

    // Move time forward
    await network.provider.send("evm_increaseTime", [3]);
    await network.provider.send("evm_mine");

    const beforeBalance = await usdt.balanceOf(employee.address);

    // claimFor simulates gasless claim
    const tx = await vault
      .connect(admin)
      .claimFor(0, employee.address);
    await tx.wait();

    const afterBalance = await usdt.balanceOf(employee.address);

    expect(afterBalance - beforeBalance).to.equal(200_000);

    const payment = await vault.payments(0);
    expect(payment.claimed).to.equal(true);
  });

  it("should NOT allow double claim", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const release = now + 2;

    await vault
      .connect(admin)
      .createPayment(company.address, employee.address, 150_000, release);

    await network.provider.send("evm_increaseTime", [3]);
    await network.provider.send("evm_mine");

    await vault.connect(employee).claim(0);

    await expect(vault.connect(employee).claim(0)).to.be.revertedWith(
      "Already claimed"
    );
  });

  it("should NOT allow non-payrollManager to create payments", async function () {
    const now = (await ethers.provider.getBlock("latest")).timestamp;
    const release = now + 1000;

    await expect(
      vault
        .connect(employee)
        .createPayment(company.address, employee.address, 100_000, release)
    ).to.be.revertedWith("Not payroll manager");
  });

  it("should NOT allow non-payrollManager to call claimFor", async function () {
    await expect(
      vault.connect(employee).claimFor(0, employee.address)
    ).to.be.revertedWith("Not payroll manager");
  });
});
