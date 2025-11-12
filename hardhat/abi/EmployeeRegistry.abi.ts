export const EmployeeRegistryAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "companyRegistryAddr",
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
        indexed: true,
        internalType: "address",
        name: "employee",
        type: "address",
      },
    ],
    name: "EmployeeAccepted",
    type: "event",
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
        indexed: true,
        internalType: "address",
        name: "employee",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "frequency",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lockPeriod",
        type: "uint256",
      },
    ],
    name: "EmployeeAdded",
    type: "event",
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
        indexed: true,
        internalType: "address",
        name: "employee",
        type: "address",
      },
    ],
    name: "EmployeeTerminated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "companyId",
        type: "uint256",
      },
    ],
    name: "acceptJob",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "address",
        name: "employeeWallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "frequency",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lockPeriod",
        type: "uint256",
      },
    ],
    name: "addEmployee",
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
        name: "",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "employees",
    outputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "frequency",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lockPeriod",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "accepted",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "active",
        type: "bool",
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
        internalType: "address",
        name: "employeeWallet",
        type: "address",
      },
    ],
    name: "getEmployee",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "wallet",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "frequency",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "lockPeriod",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "accepted",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "exists",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "active",
            type: "bool",
          },
        ],
        internalType: "struct EmployeeRegistry.Employee",
        name: "",
        type: "tuple",
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
        internalType: "address",
        name: "employeeWallet",
        type: "address",
      },
    ],
    name: "isEmployee",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
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
        internalType: "address",
        name: "employeeWallet",
        type: "address",
      },
    ],
    name: "terminateEmployee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
