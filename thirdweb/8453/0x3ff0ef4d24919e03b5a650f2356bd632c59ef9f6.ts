import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
* Contract events
*/

/**
 * Represents the filters for the "CompletionProofUpdated" event.
 */
export type CompletionProofUpdatedEventFilters = Partial<{
  requestId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"}>
completer: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"completer","type":"address"}>
}>;

/**
 * Creates an event object for the CompletionProofUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { completionProofUpdatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  completionProofUpdatedEvent({
 *  requestId: ...,
 *  completer: ...,
 * })
 * ],
 * });
 * ```
 */
export function completionProofUpdatedEvent(filters: CompletionProofUpdatedEventFilters = {}) {
  return prepareEvent({
    signature: "event CompletionProofUpdated(uint256 indexed requestId, address indexed completer, string newProof)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RequestCancelled" event.
 */
export type RequestCancelledEventFilters = Partial<{
  requestId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"}>
requester: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"requester","type":"address"}>
}>;

/**
 * Creates an event object for the RequestCancelled event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { requestCancelledEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  requestCancelledEvent({
 *  requestId: ...,
 *  requester: ...,
 * })
 * ],
 * });
 * ```
 */
export function requestCancelledEvent(filters: RequestCancelledEventFilters = {}) {
  return prepareEvent({
    signature: "event RequestCancelled(uint256 indexed requestId, address indexed requester)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RequestCompleted" event.
 */
export type RequestCompletedEventFilters = Partial<{
  requestId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"}>
completer: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"completer","type":"address"}>
}>;

/**
 * Creates an event object for the RequestCompleted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { requestCompletedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  requestCompletedEvent({
 *  requestId: ...,
 *  completer: ...,
 * })
 * ],
 * });
 * ```
 */
export function requestCompletedEvent(filters: RequestCompletedEventFilters = {}) {
  return prepareEvent({
    signature: "event RequestCompleted(uint256 indexed requestId, address indexed completer, string completionProof)",
    filters,
  });
};
  

/**
 * Represents the filters for the "RequestCreated" event.
 */
export type RequestCreatedEventFilters = Partial<{
  requestId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"}>
requester: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"requester","type":"address"}>
completer: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"completer","type":"address"}>
}>;

/**
 * Creates an event object for the RequestCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { requestCreatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  requestCreatedEvent({
 *  requestId: ...,
 *  requester: ...,
 *  completer: ...,
 * })
 * ],
 * });
 * ```
 */
export function requestCreatedEvent(filters: RequestCreatedEventFilters = {}) {
  return prepareEvent({
    signature: "event RequestCreated(uint256 indexed requestId, address indexed requester, address indexed completer, address token, uint256 amount, string message)",
    filters,
  });
};
  

/**
* Contract read functions
*/

/**
 * Represents the parameters for the "getRequest" function.
 */
export type GetRequestParams = {
  requestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requestId","type":"uint256"}>
};

/**
 * Calls the "getRequest" function on the contract.
 * @param options - The options for the getRequest function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRequest } from "TODO";
 *
 * const result = await getRequest({
 *  requestId: ...,
 * });
 *
 * ```
 */
export async function getRequest(
  options: BaseTransactionOptions<GetRequestParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xc58343ef",
  [
    {
      "internalType": "uint256",
      "name": "requestId",
      "type": "uint256"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "completer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isCompleted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isCancelled",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "completionProof",
          "type": "string"
        }
      ],
      "internalType": "struct FlockIn.Request",
      "name": "",
      "type": "tuple"
    }
  ]
],
    params: [options.requestId]
  });
};


/**
 * Represents the parameters for the "getRequestsMadeByAddress" function.
 */
export type GetRequestsMadeByAddressParams = {
  requester: AbiParameterToPrimitiveType<{"internalType":"address","name":"requester","type":"address"}>
};

/**
 * Calls the "getRequestsMadeByAddress" function on the contract.
 * @param options - The options for the getRequestsMadeByAddress function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRequestsMadeByAddress } from "TODO";
 *
 * const result = await getRequestsMadeByAddress({
 *  requester: ...,
 * });
 *
 * ```
 */
export async function getRequestsMadeByAddress(
  options: BaseTransactionOptions<GetRequestsMadeByAddressParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x34d47e0a",
  [
    {
      "internalType": "address",
      "name": "requester",
      "type": "address"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "completer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isCompleted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isCancelled",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "completionProof",
          "type": "string"
        }
      ],
      "internalType": "struct FlockIn.Request[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: [options.requester]
  });
};


/**
 * Represents the parameters for the "getRequestsReceivedByAddress" function.
 */
export type GetRequestsReceivedByAddressParams = {
  completer: AbiParameterToPrimitiveType<{"internalType":"address","name":"completer","type":"address"}>
};

/**
 * Calls the "getRequestsReceivedByAddress" function on the contract.
 * @param options - The options for the getRequestsReceivedByAddress function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRequestsReceivedByAddress } from "TODO";
 *
 * const result = await getRequestsReceivedByAddress({
 *  completer: ...,
 * });
 *
 * ```
 */
export async function getRequestsReceivedByAddress(
  options: BaseTransactionOptions<GetRequestsReceivedByAddressParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x64a18c46",
  [
    {
      "internalType": "address",
      "name": "completer",
      "type": "address"
    }
  ],
  [
    {
      "components": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "completer",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isCompleted",
          "type": "bool"
        },
        {
          "internalType": "bool",
          "name": "isCancelled",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "completionProof",
          "type": "string"
        }
      ],
      "internalType": "struct FlockIn.Request[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: [options.completer]
  });
};




/**
 * Calls the "requestCounter" function on the contract.
 * @param options - The options for the requestCounter function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requestCounter } from "TODO";
 *
 * const result = await requestCounter();
 *
 * ```
 */
export async function requestCounter(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x973a814e",
  [],
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "requests" function.
 */
export type RequestsParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "requests" function on the contract.
 * @param options - The options for the requests function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requests } from "TODO";
 *
 * const result = await requests({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function requests(
  options: BaseTransactionOptions<RequestsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x81d12c58",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "uint256",
      "name": "id",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "requester",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "completer",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "token",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "internalType": "bool",
      "name": "isCompleted",
      "type": "bool"
    },
    {
      "internalType": "bool",
      "name": "isCancelled",
      "type": "bool"
    },
    {
      "internalType": "string",
      "name": "message",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "completionProof",
      "type": "string"
    }
  ]
],
    params: [options.arg_0]
  });
};


/**
* Contract write functions
*/

/**
 * Represents the parameters for the "cancelRequest" function.
 */
export type CancelRequestParams = {
  requestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requestId","type":"uint256"}>
};

/**
 * Calls the "cancelRequest" function on the contract.
 * @param options - The options for the "cancelRequest" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { cancelRequest } from "TODO";
 *
 * const transaction = cancelRequest({
 *  requestId: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function cancelRequest(
  options: BaseTransactionOptions<CancelRequestParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x3015394c",
  [
    {
      "internalType": "uint256",
      "name": "requestId",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.requestId]
  });
};


/**
 * Represents the parameters for the "completeRequest" function.
 */
export type CompleteRequestParams = {
  requestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requestId","type":"uint256"}>
completionProof: AbiParameterToPrimitiveType<{"internalType":"string","name":"completionProof","type":"string"}>
};

/**
 * Calls the "completeRequest" function on the contract.
 * @param options - The options for the "completeRequest" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { completeRequest } from "TODO";
 *
 * const transaction = completeRequest({
 *  requestId: ...,
 *  completionProof: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function completeRequest(
  options: BaseTransactionOptions<CompleteRequestParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0xab2cb4f9",
  [
    {
      "internalType": "uint256",
      "name": "requestId",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "completionProof",
      "type": "string"
    }
  ],
  []
],
    params: [options.requestId, options.completionProof]
  });
};


/**
 * Represents the parameters for the "requestFlockIn" function.
 */
export type RequestFlockInParams = {
  completer: AbiParameterToPrimitiveType<{"internalType":"address","name":"completer","type":"address"}>
token: AbiParameterToPrimitiveType<{"internalType":"address","name":"token","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"amount","type":"uint256"}>
message: AbiParameterToPrimitiveType<{"internalType":"string","name":"message","type":"string"}>
};

/**
 * Calls the "requestFlockIn" function on the contract.
 * @param options - The options for the "requestFlockIn" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { requestFlockIn } from "TODO";
 *
 * const transaction = requestFlockIn({
 *  completer: ...,
 *  token: ...,
 *  amount: ...,
 *  message: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function requestFlockIn(
  options: BaseTransactionOptions<RequestFlockInParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x723d7f64",
  [
    {
      "internalType": "address",
      "name": "completer",
      "type": "address"
    },
    {
      "internalType": "address",
      "name": "token",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "message",
      "type": "string"
    }
  ],
  []
],
    params: [options.completer, options.token, options.amount, options.message]
  });
};


/**
 * Represents the parameters for the "updateCompletionProof" function.
 */
export type UpdateCompletionProofParams = {
  requestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requestId","type":"uint256"}>
newProof: AbiParameterToPrimitiveType<{"internalType":"string","name":"newProof","type":"string"}>
};

/**
 * Calls the "updateCompletionProof" function on the contract.
 * @param options - The options for the "updateCompletionProof" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { updateCompletionProof } from "TODO";
 *
 * const transaction = updateCompletionProof({
 *  requestId: ...,
 *  newProof: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function updateCompletionProof(
  options: BaseTransactionOptions<UpdateCompletionProofParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x3e158f46",
  [
    {
      "internalType": "uint256",
      "name": "requestId",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "newProof",
      "type": "string"
    }
  ],
  []
],
    params: [options.requestId, options.newProof]
  });
};


