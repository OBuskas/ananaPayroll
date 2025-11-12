// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CompanyRegistry.sol";
import "./EmployeeRegistry.sol";
import "./PaymentVault.sol";

contract PayrollManager {
    CompanyRegistry public companyRegistry;
    EmployeeRegistry public employeeRegistry;
    PaymentVault public paymentVault;

    event PayrollRunCreated(
        uint256 indexed companyId,
        uint256 timestamp,
        uint256 paymentsCount
    );

    constructor(
        address companyRegistryAddr,
        address employeeRegistryAddr,
        address paymentVaultAddr
    ) {
        companyRegistry = CompanyRegistry(companyRegistryAddr);
        employeeRegistry = EmployeeRegistry(employeeRegistryAddr);
        paymentVault = PaymentVault(paymentVaultAddr);
    }

    modifier onlyCompanyAdmin(uint256 companyId) {
        CompanyRegistry.Company memory comp = companyRegistry.getCompany(companyId);
        require(comp.admin == msg.sender, "Not company admin");
        _;
    }

    /**
     * Create a payroll run for all employees
     */
    function createPayrollRun(
        uint256 companyId,
        address[] calldata employeeWallets
    ) external onlyCompanyAdmin(companyId) {
        uint256 paymentsCreated = 0;

        for (uint256 i = 0; i < employeeWallets.length; i++) {
            address employeeWallet = employeeWallets[i];

            // Get employee data
            EmployeeRegistry.Employee memory emp =
                employeeRegistry.getEmployee(companyId, employeeWallet);

            if (!emp.exists) continue;       // skip invalid
            if (!emp.accepted) continue;     // skip unaccepted
            if (!emp.active) continue;       // NEW: skip terminated employees

            // Compute release time
            uint256 releaseAt = block.timestamp + emp.lockPeriod;

            // Create payment in vault
            paymentVault.createPayment(
                msg.sender,        // company admin wallet
                employeeWallet,
                emp.amount,
                releaseAt
            );

            paymentsCreated++;
        }

        emit PayrollRunCreated(companyId, block.timestamp, paymentsCreated);
    }

    /**
     * Called by Relayer to trigger gasless claim
     */
    function claimFor(
        uint256 paymentId,
        address employee
    ) external {
        // Only relayer (external system) should be allowed — for now we keep simple
        // Future: add signature verification EIP-712
        paymentVault.claimFor(paymentId, employee);
    }
}
