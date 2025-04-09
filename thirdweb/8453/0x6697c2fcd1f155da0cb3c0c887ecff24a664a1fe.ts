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
    signature: "event RequestCompleted(uint256 indexed requestId, address indexed completer)",
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
    signature: "event RequestCreated(uint256 indexed requestId, address indexed requester, address indexed completer, uint256 amount, string message)",
    filters,
  });
};
  

/**
* Contract read functions
*/



/**
 * Calls the "REQUEST_AMOUNT" function on the contract.
 * @param options - The options for the REQUEST_AMOUNT function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { REQUEST_AMOUNT } from "TODO";
 *
 * const result = await REQUEST_AMOUNT();
 *
 * ```
 */
export async function REQUEST_AMOUNT(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x16d26e3a",
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
 * Calls the "getRequestsMade" function on the contract.
 * @param options - The options for the getRequestsMade function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRequestsMade } from "TODO";
 *
 * const result = await getRequestsMade();
 *
 * ```
 */
export async function getRequestsMade(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xb2e41e09",
  [],
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "requesterFid",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "completer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "completerFid",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isClaimed",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "internalType": "struct FlockIn.Request[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: []
  });
};




/**
 * Calls the "getRequestsReceived" function on the contract.
 * @param options - The options for the getRequestsReceived function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRequestsReceived } from "TODO";
 *
 * const result = await getRequestsReceived();
 *
 * ```
 */
export async function getRequestsReceived(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xcd5f63c3",
  [],
  [
    {
      "components": [
        {
          "internalType": "address",
          "name": "requester",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "requesterFid",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "completer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "completerFid",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isClaimed",
          "type": "bool"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        }
      ],
      "internalType": "struct FlockIn.Request[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: []
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
      "internalType": "address",
      "name": "requester",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "requesterFid",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "completer",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "completerFid",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "internalType": "bool",
      "name": "isClaimed",
      "type": "bool"
    },
    {
      "internalType": "string",
      "name": "message",
      "type": "string"
    }
  ]
],
    params: [options.arg_0]
  });
};


/**
 * Represents the parameters for the "requestsMade" function.
 */
export type RequestsMadeParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "requestsMade" function on the contract.
 * @param options - The options for the requestsMade function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requestsMade } from "TODO";
 *
 * const result = await requestsMade({
 *  arg_0: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function requestsMade(
  options: BaseTransactionOptions<RequestsMadeParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x7712b867",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "requester",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "requesterFid",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "completer",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "completerFid",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "internalType": "bool",
      "name": "isClaimed",
      "type": "bool"
    },
    {
      "internalType": "string",
      "name": "message",
      "type": "string"
    }
  ]
],
    params: [options.arg_0, options.arg_1]
  });
};


/**
 * Represents the parameters for the "requestsReceived" function.
 */
export type RequestsReceivedParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "requestsReceived" function on the contract.
 * @param options - The options for the requestsReceived function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requestsReceived } from "TODO";
 *
 * const result = await requestsReceived({
 *  arg_0: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function requestsReceived(
  options: BaseTransactionOptions<RequestsReceivedParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x52a2c718",
  [
    {
      "internalType": "address",
      "name": "",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  [
    {
      "internalType": "address",
      "name": "requester",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "requesterFid",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "completer",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "completerFid",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    },
    {
      "internalType": "bool",
      "name": "isClaimed",
      "type": "bool"
    },
    {
      "internalType": "string",
      "name": "message",
      "type": "string"
    }
  ]
],
    params: [options.arg_0, options.arg_1]
  });
};




/**
 * Calls the "token" function on the contract.
 * @param options - The options for the token function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { token } from "TODO";
 *
 * const result = await token();
 *
 * ```
 */
export async function token(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xfc0c546a",
  [],
  [
    {
      "internalType": "contract IERC20",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
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
  "0xcc1e0359",
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
 * Represents the parameters for the "requestFlockIn" function.
 */
export type RequestFlockInParams = {
  requesterFid: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requesterFid","type":"uint256"}>
completer: AbiParameterToPrimitiveType<{"internalType":"address","name":"completer","type":"address"}>
completerFid: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"completerFid","type":"uint256"}>
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
 *  requesterFid: ...,
 *  completer: ...,
 *  completerFid: ...,
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
  "0x3e7d44d2",
  [
    {
      "internalType": "uint256",
      "name": "requesterFid",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "completer",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "completerFid",
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
    params: [options.requesterFid, options.completer, options.completerFid, options.message]
  });
};


