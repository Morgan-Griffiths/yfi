/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { GLDToken } from "../GLDToken";

export class GLDToken__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<GLDToken> {
    return super.deploy(overrides || {}) as Promise<GLDToken>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): GLDToken {
    return super.attach(address) as GLDToken;
  }
  connect(signer: Signer): GLDToken__factory {
    return super.connect(signer) as GLDToken__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): GLDToken {
    return new Contract(address, _abi, signerOrProvider) as GLDToken;
  }
}

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "ethAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
    ],
    name: "convertEthToDai",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
    outputs: [
      {
        internalType: "address",
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
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleMemberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
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
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapRouter",
    outputs: [
      {
        internalType: "contract UniswapV2Router02",
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
        internalType: "address",
        name: "recipient",
        type: "address",
      },
    ],
    name: "whitelistAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280600481526020017f476f6c64000000000000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f474c44000000000000000000000000000000000000000000000000000000000081525081600390805190602001906200009692919062000307565b508060049080519060200190620000af92919062000307565b506012600560006101000a81548160ff021916908360ff1602179055505050737a250d5630b4cf539739df2c5dacb4c659f2488d600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506200016a60405180807f4d494e5445525f524f4c45000000000000000000000000000000000000000000815250600b0190506040518091039020336200017060201b60201c565b620003b6565b6200018282826200018660201b60201c565b5050565b620001b581600660008581526020019081526020016000206000016200022a60201b6200257f1790919060201c565b156200022657620001cb6200026260201b60201c565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b60006200025a836000018373ffffffffffffffffffffffffffffffffffffffff1660001b6200026a60201b60201c565b905092915050565b600033905090565b60006200027e8383620002e460201b60201c565b620002d9578260000182908060018154018082558091505060019003906000526020600020016000909190919091505582600001805490508360010160008481526020019081526020016000208190555060019050620002de565b600090505b92915050565b600080836001016000848152602001908152602001600020541415905092915050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200034a57805160ff19168380011785556200037b565b828001600101855582156200037b579182015b828111156200037a5782518255916020019190600101906200035d565b5b5090506200038a91906200038e565b5090565b620003b391905b80821115620003af57600081600090555060010162000395565b5090565b90565b612a4080620003c66000396000f3fe60806040526004361061014f5760003560e01c806370a08231116100b6578063a457c2d71161006f578063a457c2d714610912578063a9059cbb14610985578063ca15c873146109f8578063d539139314610a47578063d547741f14610a72578063dd62ed3e14610acd57610270565b806370a08231146106a3578063735de9f7146107085780639010d07c1461075f57806391d14854146107e457806395d89b4114610857578063a217fddf146108e757610270565b80632f2ff15d116101085780632f2ff15d146104c0578063313ce5671461051b57806336568abe1461054c57806339509351146105a7578063415665851461061a578063583fb4631461066b57610270565b806306fdde0314610275578063095ea7b31461030557806318160ddd1461037857806323b872dd146103a3578063248a9ca3146104365780632e1a7d4d1461048557610270565b366102705761019360405180807f4d494e5445525f524f4c45000000000000000000000000000000000000000000815250600b019050604051809103902033610b52565b610205576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f43616c6c6572206973206e6f742061206d696e7465720000000000000000000081525060200191505060405180910390fd5b662386f26fc100003411610264576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806128da6021913960400191505060405180910390fd5b61026e3334610b84565b005b600080fd5b34801561028157600080fd5b5061028a610d4b565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102ca5780820151818401526020810190506102af565b50505050905090810190601f1680156102f75780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561031157600080fd5b5061035e6004803603604081101561032857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610ded565b604051808215151515815260200191505060405180910390f35b34801561038457600080fd5b5061038d610e0b565b6040518082815260200191505060405180910390f35b3480156103af57600080fd5b5061041c600480360360608110156103c657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610e15565b604051808215151515815260200191505060405180910390f35b34801561044257600080fd5b5061046f6004803603602081101561045957600080fd5b8101908080359060200190929190505050610eee565b6040518082815260200191505060405180910390f35b34801561049157600080fd5b506104be600480360360208110156104a857600080fd5b8101908080359060200190929190505050610f0e565b005b3480156104cc57600080fd5b50610519600480360360408110156104e357600080fd5b8101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611074565b005b34801561052757600080fd5b506105306110fe565b604051808260ff1660ff16815260200191505060405180910390f35b34801561055857600080fd5b506105a56004803603604081101561056f57600080fd5b8101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611115565b005b3480156105b357600080fd5b50610600600480360360408110156105ca57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506111ae565b604051808215151515815260200191505060405180910390f35b34801561062657600080fd5b506106696004803603602081101561063d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611261565b005b6106a16004803603604081101561068157600080fd5b810190808035906020019092919080359060200190929190505050611406565b005b3480156106af57600080fd5b506106f2600480360360208110156106c657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506117d4565b6040518082815260200191505060405180910390f35b34801561071457600080fd5b5061071d61181c565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561076b57600080fd5b506107a26004803603604081101561078257600080fd5b810190808035906020019092919080359060200190929190505050611842565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156107f057600080fd5b5061083d6004803603604081101561080757600080fd5b8101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b52565b604051808215151515815260200191505060405180910390f35b34801561086357600080fd5b5061086c611874565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156108ac578082015181840152602081019050610891565b50505050905090810190601f1680156108d95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156108f357600080fd5b506108fc611916565b6040518082815260200191505060405180910390f35b34801561091e57600080fd5b5061096b6004803603604081101561093557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061191d565b604051808215151515815260200191505060405180910390f35b34801561099157600080fd5b506109de600480360360408110156109a857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506119ea565b604051808215151515815260200191505060405180910390f35b348015610a0457600080fd5b50610a3160048036036020811015610a1b57600080fd5b8101908080359060200190929190505050611a08565b6040518082815260200191505060405180910390f35b348015610a5357600080fd5b50610a5c611a2f565b6040518082815260200191505060405180910390f35b348015610a7e57600080fd5b50610acb60048036036040811015610a9557600080fd5b8101908080359060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611a68565b005b348015610ad957600080fd5b50610b3c60048036036040811015610af057600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611af2565b6040518082815260200191505060405180910390f35b6000610b7c8260066000868152602001908152602001600020600001611b7990919063ffffffff16565b905092915050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610c27576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f45524332303a206d696e7420746f20746865207a65726f20616464726573730081525060200191505060405180910390fd5b610c3360008383611ba9565b610c4881600254611bae90919063ffffffff16565b600281905550610c9f816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611bae90919063ffffffff16565b6000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050565b606060038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610de35780601f10610db857610100808354040283529160200191610de3565b820191906000526020600020905b815481529060010190602001808311610dc657829003601f168201915b5050505050905090565b6000610e01610dfa611c36565b8484611c3e565b6001905092915050565b6000600254905090565b6000610e22848484611e35565b610ee384610e2e611c36565b610ede8560405180606001604052806028815260200161292560289139600160008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000610e94611c36565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546120f69092919063ffffffff16565b611c3e565b600190509392505050565b600060066000838152602001908152602001600020600201549050919050565b610f4d60405180807f4d494e5445525f524f4c45000000000000000000000000000000000000000000815250600b019050604051809103902033610b52565b610fbf576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f43616c6c6572206973206e6f742061206d696e7465720000000000000000000081525060200191505060405180910390fd5b80610fc9336117d4565b1015611020576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602a8152602001806128fb602a913960400191505060405180910390fd5b61102a33826121b0565b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050158015611070573d6000803e3d6000fd5b5050565b61109b6006600084815260200190815260200160002060020154611096611c36565b610b52565b6110f0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f815260200180612811602f913960400191505060405180910390fd5b6110fa8282612374565b5050565b6000600560009054906101000a900460ff16905090565b61111d611c36565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146111a0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f8152602001806129dc602f913960400191505060405180910390fd5b6111aa8282612408565b5050565b60006112576111bb611c36565b8461125285600160006111cc611c36565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611bae90919063ffffffff16565b611c3e565b6001905092915050565b6112a060405180807f4d494e5445525f524f4c45000000000000000000000000000000000000000000815250600b019050604051809103902082610b52565b15611313576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601d8152602001807f526563697069656e7420697320616c72656164792061206d696e74657200000081525060200191505060405180910390fd5b61135260405180807f4d494e5445525f524f4c45000000000000000000000000000000000000000000815250600b019050604051809103902033610b52565b6113c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f43616c6c6572206973206e6f742061206d696e7465720000000000000000000081525060200191505060405180910390fd5b61140360405180807f4d494e5445525f524f4c45000000000000000000000000000000000000000000815250600b01905060405180910390208261249c565b50565b6060600267ffffffffffffffff8111801561142057600080fd5b5060405190808252806020026020018201604052801561144f5781602001602082028036833780820191505090505b509050600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663ad5c46486040518163ffffffff1660e01b815260040160206040518083038186803b1580156114ba57600080fd5b505afa1580156114ce573d6000803e3d6000fd5b505050506040513d60208110156114e457600080fd5b81019080805190602001909291905050508160008151811061150257fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050736b175474e89094c44da98b954eedeac495271d0f8160018151811061155e57fe5b602002602001019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637ff36ab534858430876040518663ffffffff1660e01b815260040180858152602001806020018473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828103825285818151815260200191508051906020019060200280838360005b8381101561166b578082015181840152602081019050611650565b50505050905001955050505050506000604051808303818588803b15801561169257600080fd5b505af11580156116a6573d6000803e3d6000fd5b50505050506040513d6000823e3d601f19601f8201168201806040525060208110156116d157600080fd5b81019080805160405193929190846401000000008211156116f157600080fd5b8382019150602082018581111561170757600080fd5b825186602082028301116401000000008211171561172457600080fd5b8083526020830192505050908051906020019060200280838360005b8381101561175b578082015181840152602081019050611740565b50505050905001604052505050503373ffffffffffffffffffffffffffffffffffffffff164760405180600001905060006040518083038185875af1925050503d80600081146117c7576040519150601f19603f3d011682016040523d82523d6000602084013e6117cc565b606091505b505050505050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600061186c82600660008681526020019081526020016000206000016124aa90919063ffffffff16565b905092915050565b606060048054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561190c5780601f106118e15761010080835404028352916020019161190c565b820191906000526020600020905b8154815290600101906020018083116118ef57829003601f168201915b5050505050905090565b6000801b81565b60006119e061192a611c36565b846119db856040518060600160405280602581526020016129b76025913960016000611954611c36565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546120f69092919063ffffffff16565b611c3e565b6001905092915050565b60006119fe6119f7611c36565b8484611e35565b6001905092915050565b6000611a28600660008481526020019081526020016000206000016124c4565b9050919050565b60405180807f4d494e5445525f524f4c45000000000000000000000000000000000000000000815250600b019050604051809103902081565b611a8f6006600084815260200190815260200160002060020154611a8a611c36565b610b52565b611ae4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260308152602001806128aa6030913960400191505060405180910390fd5b611aee8282612408565b5050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b6000611ba1836000018373ffffffffffffffffffffffffffffffffffffffff1660001b6124d9565b905092915050565b505050565b600080828401905083811015611c2c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601b8152602001807f536166654d6174683a206164646974696f6e206f766572666c6f77000000000081525060200191505060405180910390fd5b8091505092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611cc4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260248152602001806129936024913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611d4a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806128626022913960400191505060405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040518082815260200191505060405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415611ebb576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602581526020018061296e6025913960400191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611f41576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260238152602001806127ee6023913960400191505060405180910390fd5b611f4c838383611ba9565b611fb781604051806060016040528060268152602001612884602691396000808773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546120f69092919063ffffffff16565b6000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061204a816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611bae90919063ffffffff16565b6000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a3505050565b60008383111582906121a3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b8381101561216857808201518184015260208101905061214d565b50505050905090810190601f1680156121955780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b5082840390509392505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415612236576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602181526020018061294d6021913960400191505060405180910390fd5b61224282600083611ba9565b6122ad81604051806060016040528060228152602001612840602291396000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546120f69092919063ffffffff16565b6000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550612304816002546124fc90919063ffffffff16565b600281905550600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050565b61239c816006600085815260200190815260200160002060000161257f90919063ffffffff16565b15612404576123a9611c36565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b61243081600660008581526020019081526020016000206000016125af90919063ffffffff16565b156124985761243d611c36565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45b5050565b6124a68282612374565b5050565b60006124b983600001836125df565b60001c905092915050565b60006124d282600001612662565b9050919050565b600080836001016000848152602001908152602001600020541415905092915050565b600082821115612574576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601e8152602001807f536166654d6174683a207375627472616374696f6e206f766572666c6f77000081525060200191505060405180910390fd5b818303905092915050565b60006125a7836000018373ffffffffffffffffffffffffffffffffffffffff1660001b612673565b905092915050565b60006125d7836000018373ffffffffffffffffffffffffffffffffffffffff1660001b6126e3565b905092915050565b600081836000018054905011612640576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260228152602001806127cc6022913960400191505060405180910390fd5b82600001828154811061264f57fe5b9060005260206000200154905092915050565b600081600001805490509050919050565b600061267f83836124d9565b6126d85782600001829080600181540180825580915050600190039060005260206000200160009091909190915055826000018054905083600101600084815260200190815260200160002081905550600190506126dd565b600090505b92915050565b600080836001016000848152602001908152602001600020549050600081146127bf576000600182039050600060018660000180549050039050600086600001828154811061272e57fe5b906000526020600020015490508087600001848154811061274b57fe5b906000526020600020018190555060018301876001016000838152602001908152602001600020819055508660000180548061278357fe5b600190038181906000526020600020016000905590558660010160008781526020019081526020016000206000905560019450505050506127c5565b60009150505b9291505056fe456e756d657261626c655365743a20696e646578206f7574206f6620626f756e647345524332303a207472616e7366657220746f20746865207a65726f2061646472657373416363657373436f6e74726f6c3a2073656e646572206d75737420626520616e2061646d696e20746f206772616e7445524332303a206275726e20616d6f756e7420657863656564732062616c616e636545524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e6365416363657373436f6e74726f6c3a2073656e646572206d75737420626520616e2061646d696e20746f207265766f6b65496e73756666696369656e7420616d6f756e74206f662065746865722073656e74416d6f756e7420746f207769746864726177206578636565647320616464726573732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a206275726e2066726f6d20746865207a65726f206164647265737345524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636520726f6c657320666f722073656c66a2646970667358221220595dcb171b2718bb37d947700513b5574baada97e07bfed93d776fade7c5eb6a64736f6c63430006060033";
