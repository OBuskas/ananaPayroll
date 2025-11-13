// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentVault {
    IERC20 public usdt;
    address public payrollManager;

    struct Payment {
        uint256 id;
        address company;
        address employee;
        uint256 amount;
        uint256 releaseAt;
        bool claimed;
    }

    uint256 public nextPaymentId;
    mapping(uint256 => Payment) public payments;
    mapping(address => uint256) public companyBalances;

    event PaymentCreated(
        uint256 indexed paymentId,
        address indexed company,
        address indexed employee,
        uint256 amount,
        uint256 releaseAt
    );

    event PaymentClaimed(
        uint256 indexed paymentId,
        address indexed employee,
        uint256 amount
    );

    event FundsDeposited(address indexed company, uint256 amount);

    modifier onlyPayrollManager() {
        require(msg.sender == payrollManager, "Not payroll manager");
        _;
    }

    constructor(address usdtAddress) {
        usdt = IERC20(usdtAddress);
    }

    function setPayrollManager(address manager) external {
        require(payrollManager == address(0), "Already set");
        payrollManager = manager;
    }

    /**
     * Deposit funds to the vault for payroll payments
     * Company must approve this contract to spend USDT first
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            usdt.transferFrom(msg.sender, address(this), amount),
            "USDT transfer failed"
        );
        companyBalances[msg.sender] += amount;
        emit FundsDeposited(msg.sender, amount);
    }

    /**
     * Get the available balance for a company
     */
    function getCompanyBalance(
        address company
    ) external view returns (uint256) {
        return companyBalances[company];
    }

    // PayrollManager calls this to create a scheduled payment
    function createPayment(
        address company,
        address employee,
        uint256 amount,
        uint256 releaseAt
    ) external onlyPayrollManager returns (uint256 paymentId) {
        require(employee != address(0), "Invalid employee");
        require(amount > 0, "Invalid amount");
        require(releaseAt > block.timestamp, "Invalid release time");
        require(companyBalances[company] >= amount, "Insufficient balance");

        // Deduct from company balance
        companyBalances[company] -= amount;

        paymentId = nextPaymentId++;

        payments[paymentId] = Payment({
            id: paymentId,
            company: company,
            employee: employee,
            amount: amount,
            releaseAt: releaseAt,
            claimed: false
        });

        emit PaymentCreated(paymentId, company, employee, amount, releaseAt);
    }

    // Employee claims payment
    function claim(uint256 paymentId) external {
        Payment storage p = payments[paymentId];

        require(!p.claimed, "Already claimed");
        require(p.employee == msg.sender, "Not employee");
        require(block.timestamp >= p.releaseAt, "Locked");

        p.claimed = true;

        require(usdt.transfer(p.employee, p.amount), "USDT transfer failed");

        emit PaymentClaimed(paymentId, p.employee, p.amount);
    }

    // Used by relayer for gasless claims
    function claimFor(
        uint256 paymentId,
        address employee
    ) external onlyPayrollManager {
        Payment storage p = payments[paymentId];

        require(!p.claimed, "Already claimed");
        require(p.employee == employee, "Invalid employee");
        require(block.timestamp >= p.releaseAt, "Locked");

        p.claimed = true;

        require(usdt.transfer(employee, p.amount), "USDT transfer failed");

        emit PaymentClaimed(paymentId, employee, p.amount);
    }
}
