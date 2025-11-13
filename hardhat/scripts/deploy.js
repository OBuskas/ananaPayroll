const hre = require("hardhat");
const fs = require("node:fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("==========================================");
  console.log(" Deploying Smart Contracts to Sepolia");
  console.log("==========================================");
  console.log("Deployer Address:", deployer.address);
  console.log("------------------------------------------");

  // 1. Mock USDT
  console.log("Deploying MockUSDT...");
  const MockUSDT = await hre.ethers.getContractFactory("MockUSDT");
  const usdt = await MockUSDT.deploy();
  await usdt.waitForDeployment();
  console.log("MockUSDT deployed at:", usdt.target);

  // 2. CompanyRegistry
  console.log("Deploying CompanyRegistry...");
  const CompanyRegistry =
    await hre.ethers.getContractFactory("CompanyRegistry");
  const companyRegistry = await CompanyRegistry.deploy();
  await companyRegistry.waitForDeployment();
  console.log("CompanyRegistry deployed at:", companyRegistry.target);

  // 3. EmployeeRegistry
  console.log("Deploying EmployeeRegistry...");
  const EmployeeRegistry =
    await hre.ethers.getContractFactory("EmployeeRegistry");
  const employeeRegistry = await EmployeeRegistry.deploy(
    companyRegistry.target
  );
  await employeeRegistry.waitForDeployment();
  console.log("EmployeeRegistry deployed at:", employeeRegistry.target);

  // 4. PaymentVault
  console.log("Deploying PaymentVault...");
  const PaymentVault = await hre.ethers.getContractFactory("PaymentVault");
  const vault = await PaymentVault.deploy(usdt.target);
  await vault.waitForDeployment();
  console.log("PaymentVault deployed at:", vault.target);

  // 5. PayrollManager
  console.log("Deploying PayrollManager...");
  const PayrollManager = await hre.ethers.getContractFactory("PayrollManager");
  const manager = await PayrollManager.deploy(
    companyRegistry.target,
    employeeRegistry.target,
    vault.target
  );
  await manager.waitForDeployment();
  console.log("PayrollManager deployed at:", manager.target);

  // 6. Link PayrollManager → PaymentVault
  console.log("Setting PayrollManager in PaymentVault...");
  await vault.setPayrollManager(manager.target);
  console.log("PayrollManager linked successfully.");

  // Save deployed addresses
  const data = {
    network: "sepolia",
    MockUSDT: usdt.target,
    CompanyRegistry: companyRegistry.target,
    EmployeeRegistry: employeeRegistry.target,
    PaymentVault: vault.target,
    PayrollManager: manager.target,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync("deployed.json", JSON.stringify(data, null, 2));
  console.log("\n✅ Deploy completed and saved to deployed.json\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
