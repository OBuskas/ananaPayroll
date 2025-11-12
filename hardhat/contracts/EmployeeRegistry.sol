// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CompanyRegistry.sol";

contract EmployeeRegistry {
    CompanyRegistry public companyRegistry;

    struct Employee {
        address wallet;
        uint256 amount;       // USDT amount per payroll run
        uint256 frequency;    // seconds between payments
        uint256 lockPeriod;   // mandatory lock before withdrawal
        bool accepted;        // employee must accept job
        bool exists;
        bool active;          // NEW: employee can be terminated
    }

    // companyId => employeeWallet => Employee
    mapping(uint256 => mapping(address => Employee)) public employees;

    event EmployeeAdded(
        uint256 indexed companyId,
        address indexed employee,
        uint256 amount,
        uint256 frequency,
        uint256 lockPeriod
    );

    event EmployeeAccepted(
        uint256 indexed companyId,
        address indexed employee
    );

    event EmployeeTerminated(
        uint256 indexed companyId,
        address indexed employee
    );

    constructor(address companyRegistryAddr) {
        companyRegistry = CompanyRegistry(companyRegistryAddr);
    }

    modifier onlyCompanyAdmin(uint256 companyId) {
        CompanyRegistry.Company memory comp = companyRegistry.getCompany(companyId);
        require(comp.exists, "Company does not exist");
        require(comp.admin == msg.sender, "Not company admin");
        _;
    }

    function addEmployee(
        uint256 companyId,
        address employeeWallet,
        uint256 amount,
        uint256 frequency,
        uint256 lockPeriod
    ) external onlyCompanyAdmin(companyId) {
        require(employeeWallet != address(0), "Invalid wallet");
        require(!employees[companyId][employeeWallet].exists, "Already added");

        employees[companyId][employeeWallet] = Employee({
            wallet: employeeWallet,
            amount: amount,
            frequency: frequency,
            lockPeriod: lockPeriod,
            accepted: false,
            exists: true,
            active: true      // NEW default value
        });

        emit EmployeeAdded(companyId, employeeWallet, amount, frequency, lockPeriod);
    }

    function acceptJob(uint256 companyId) external {
        Employee storage emp = employees[companyId][msg.sender];
        require(emp.exists, "Employee not found");
        require(!emp.accepted, "Already accepted");
        require(emp.active, "Employee inactive");

        emp.accepted = true;

        emit EmployeeAccepted(companyId, msg.sender);
    }

    // NEW: terminate employment (resignation or firing)
    function terminateEmployee(uint256 companyId, address employeeWallet)
        external
        onlyCompanyAdmin(companyId)
    {
        Employee storage emp = employees[companyId][employeeWallet];

        require(emp.exists, "Employee not found");
        require(emp.active, "Already inactive");

        emp.active = false;

        emit EmployeeTerminated(companyId, employeeWallet);
    }

    function getEmployee(uint256 companyId, address employeeWallet)
        external
        view
        returns (Employee memory)
    {
        return employees[companyId][employeeWallet];
    }

    function isEmployee(uint256 companyId, address employeeWallet)
        external
        view
        returns (bool)
    {
        return employees[companyId][employeeWallet].exists;
    }
}
