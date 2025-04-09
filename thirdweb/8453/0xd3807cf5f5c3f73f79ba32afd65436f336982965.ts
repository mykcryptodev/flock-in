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
 * Represents the parameters for the "getRequestsMadeByFid" function.
 */
export type GetRequestsMadeByFidParams = {
  requesterFid: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requesterFid","type":"uint256"}>
};

/**
 * Calls the "getRequestsMadeByFid" function on the contract.
 * @param options - The options for the getRequestsMadeByFid function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRequestsMadeByFid } from "TODO";
 *
 * const result = await getRequestsMadeByFid({
 *  requesterFid: ...,
 * });
 *
 * ```
 */
export async function getRequestsMadeByFid(
  options: BaseTransactionOptions<GetRequestsMadeByFidParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe0fc7264",
  [
    {
      "internalType": "uint256",
      "name": "requesterFid",
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
        }
      ],
      "internalType": "struct FlockIn.Request[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: [options.requesterFid]
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
 * Represents the parameters for the "getRequestsReceivedByFid" function.
 */
export type GetRequestsReceivedByFidParams = {
  completerFid: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"completerFid","type":"uint256"}>
};

/**
 * Calls the "getRequestsReceivedByFid" function on the contract.
 * @param options - The options for the getRequestsReceivedByFid function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRequestsReceivedByFid } from "TODO";
 *
 * const result = await getRequestsReceivedByFid({
 *  completerFid: ...,
 * });
 *
 * ```
 */
export async function getRequestsReceivedByFid(
  options: BaseTransactionOptions<GetRequestsReceivedByFidParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x7f7134c9",
  [
    {
      "internalType": "uint256",
      "name": "completerFid",
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
        }
      ],
      "internalType": "struct FlockIn.Request[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: [options.completerFid]
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
    }
  ]
],
    params: [options.arg_0]
  });
};


/**
 * Represents the parameters for the "requestsMadeByAddress" function.
 */
export type RequestsMadeByAddressParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "requestsMadeByAddress" function on the contract.
 * @param options - The options for the requestsMadeByAddress function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requestsMadeByAddress } from "TODO";
 *
 * const result = await requestsMadeByAddress({
 *  arg_0: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function requestsMadeByAddress(
  options: BaseTransactionOptions<RequestsMadeByAddressParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xbc5adc3e",
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
    }
  ]
],
    params: [options.arg_0, options.arg_1]
  });
};


/**
 * Represents the parameters for the "requestsMadeByFid" function.
 */
export type RequestsMadeByFidParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "requestsMadeByFid" function on the contract.
 * @param options - The options for the requestsMadeByFid function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requestsMadeByFid } from "TODO";
 *
 * const result = await requestsMadeByFid({
 *  arg_0: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function requestsMadeByFid(
  options: BaseTransactionOptions<RequestsMadeByFidParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xc2cafa42",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
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
    }
  ]
],
    params: [options.arg_0, options.arg_1]
  });
};


/**
 * Represents the parameters for the "requestsReceivedByAddress" function.
 */
export type RequestsReceivedByAddressParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"address","name":"","type":"address"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "requestsReceivedByAddress" function on the contract.
 * @param options - The options for the requestsReceivedByAddress function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requestsReceivedByAddress } from "TODO";
 *
 * const result = await requestsReceivedByAddress({
 *  arg_0: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function requestsReceivedByAddress(
  options: BaseTransactionOptions<RequestsReceivedByAddressParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xf0779f79",
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
    }
  ]
],
    params: [options.arg_0, options.arg_1]
  });
};


/**
 * Represents the parameters for the "requestsReceivedByFid" function.
 */
export type RequestsReceivedByFidParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
arg_1: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "requestsReceivedByFid" function on the contract.
 * @param options - The options for the requestsReceivedByFid function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requestsReceivedByFid } from "TODO";
 *
 * const result = await requestsReceivedByFid({
 *  arg_0: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function requestsReceivedByFid(
  options: BaseTransactionOptions<RequestsReceivedByFidParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x6a363d92",
  [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    },
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


