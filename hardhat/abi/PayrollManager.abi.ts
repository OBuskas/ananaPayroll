export const PayrollManagerAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "companyRegistryAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "employeeRegistryAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "paymentVaultAddr",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "companyId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paymentsCount",
        type: "uint256",
      },
    ],
    name: "PayrollRunCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "employee",
        type: "address",
      },
    ],
    name: "claimFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "companyRegistry",
    outputs: [
      {
        internalType: "contract CompanyRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "companyId",
        type: "uint256",
      },
      {
        internalType: "address[]",
        name: "employeeWallets",
        type: "address[]",
      },
    ],
    name: "createPayrollRun",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "employeeRegistry",
    outputs: [
      {
        internalType: "contract EmployeeRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "paymentVault",
    outputs: [
      {
        internalType: "contract PaymentVault",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
