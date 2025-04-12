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
 * Represents the filters for the "ReviewCreated" event.
 */
export type ReviewCreatedEventFilters = Partial<{
  reviewId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"reviewId","type":"uint256"}>
requestId: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"uint256","name":"requestId","type":"uint256"}>
reviewer: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"reviewer","type":"address"}>
}>;

/**
 * Creates an event object for the ReviewCreated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { reviewCreatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  reviewCreatedEvent({
 *  reviewId: ...,
 *  requestId: ...,
 *  reviewer: ...,
 * })
 * ],
 * });
 * ```
 */
export function reviewCreatedEvent(filters: ReviewCreatedEventFilters = {}) {
  return prepareEvent({
    signature: "event ReviewCreated(uint256 indexed reviewId, uint256 indexed requestId, address indexed reviewer, address reviewee, uint256 rating, string comment, bool reviewCreatedBeforeCompletion)",
    filters,
  });
};
  

/**
* Contract read functions
*/



/**
 * Calls the "flockIn" function on the contract.
 * @param options - The options for the flockIn function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { flockIn } from "TODO";
 *
 * const result = await flockIn();
 *
 * ```
 */
export async function flockIn(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x5ab46296",
  [],
  [
    {
      "internalType": "contract FlockIn",
      "name": "",
      "type": "address"
    }
  ]
],
    params: []
  });
};


/**
 * Represents the parameters for the "getReview" function.
 */
export type GetReviewParams = {
  reviewId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"reviewId","type":"uint256"}>
};

/**
 * Calls the "getReview" function on the contract.
 * @param options - The options for the getReview function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getReview } from "TODO";
 *
 * const result = await getReview({
 *  reviewId: ...,
 * });
 *
 * ```
 */
export async function getReview(
  options: BaseTransactionOptions<GetReviewParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x990581b6",
  [
    {
      "internalType": "uint256",
      "name": "reviewId",
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
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "reviewer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "reviewerFid",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "reviewee",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "revieweeFid",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rating",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "comment",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "revieweeComment",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "metadata",
          "type": "bytes"
        },
        {
          "internalType": "bool",
          "name": "reviewCreatedBeforeCompletion",
          "type": "bool"
        }
      ],
      "internalType": "struct FlockInReviews.Review",
      "name": "",
      "type": "tuple"
    }
  ]
],
    params: [options.reviewId]
  });
};


/**
 * Represents the parameters for the "getReviewByRequestId" function.
 */
export type GetReviewByRequestIdParams = {
  requestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requestId","type":"uint256"}>
};

/**
 * Calls the "getReviewByRequestId" function on the contract.
 * @param options - The options for the getReviewByRequestId function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getReviewByRequestId } from "TODO";
 *
 * const result = await getReviewByRequestId({
 *  requestId: ...,
 * });
 *
 * ```
 */
export async function getReviewByRequestId(
  options: BaseTransactionOptions<GetReviewByRequestIdParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xa40d7caf",
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
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "reviewer",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "reviewerFid",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "reviewee",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "revieweeFid",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "rating",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "comment",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "revieweeComment",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "metadata",
          "type": "bytes"
        },
        {
          "internalType": "bool",
          "name": "reviewCreatedBeforeCompletion",
          "type": "bool"
        }
      ],
      "internalType": "struct FlockInReviews.Review",
      "name": "",
      "type": "tuple"
    }
  ]
],
    params: [options.requestId]
  });
};


/**
 * Represents the parameters for the "requestIdByReviewId" function.
 */
export type RequestIdByReviewIdParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "requestIdByReviewId" function on the contract.
 * @param options - The options for the requestIdByReviewId function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { requestIdByReviewId } from "TODO";
 *
 * const result = await requestIdByReviewId({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function requestIdByReviewId(
  options: BaseTransactionOptions<RequestIdByReviewIdParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x7c085d6c",
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
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.arg_0]
  });
};




/**
 * Calls the "reviewCounter" function on the contract.
 * @param options - The options for the reviewCounter function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { reviewCounter } from "TODO";
 *
 * const result = await reviewCounter();
 *
 * ```
 */
export async function reviewCounter(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe168b3a8",
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
 * Represents the parameters for the "reviewIdByRequestId" function.
 */
export type ReviewIdByRequestIdParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "reviewIdByRequestId" function on the contract.
 * @param options - The options for the reviewIdByRequestId function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { reviewIdByRequestId } from "TODO";
 *
 * const result = await reviewIdByRequestId({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function reviewIdByRequestId(
  options: BaseTransactionOptions<ReviewIdByRequestIdParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x0fc9401a",
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
      "name": "",
      "type": "uint256"
    }
  ]
],
    params: [options.arg_0]
  });
};


/**
 * Represents the parameters for the "reviews" function.
 */
export type ReviewsParams = {
  arg_0: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"","type":"uint256"}>
};

/**
 * Calls the "reviews" function on the contract.
 * @param options - The options for the reviews function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { reviews } from "TODO";
 *
 * const result = await reviews({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function reviews(
  options: BaseTransactionOptions<ReviewsParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0xe83ddcea",
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
      "internalType": "uint256",
      "name": "requestId",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "reviewer",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "reviewerFid",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "reviewee",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "revieweeFid",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "rating",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "comment",
      "type": "string"
    },
    {
      "internalType": "string",
      "name": "revieweeComment",
      "type": "string"
    },
    {
      "internalType": "bytes",
      "name": "metadata",
      "type": "bytes"
    },
    {
      "internalType": "bool",
      "name": "reviewCreatedBeforeCompletion",
      "type": "bool"
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
 * Represents the parameters for the "createReview" function.
 */
export type CreateReviewParams = {
  requestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requestId","type":"uint256"}>
reviewerFid: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"reviewerFid","type":"uint256"}>
reviewee: AbiParameterToPrimitiveType<{"internalType":"address","name":"reviewee","type":"address"}>
revieweeFid: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"revieweeFid","type":"uint256"}>
rating: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"rating","type":"uint256"}>
comment: AbiParameterToPrimitiveType<{"internalType":"string","name":"comment","type":"string"}>
metadata: AbiParameterToPrimitiveType<{"internalType":"bytes","name":"metadata","type":"bytes"}>
};

/**
 * Calls the "createReview" function on the contract.
 * @param options - The options for the "createReview" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { createReview } from "TODO";
 *
 * const transaction = createReview({
 *  requestId: ...,
 *  reviewerFid: ...,
 *  reviewee: ...,
 *  revieweeFid: ...,
 *  rating: ...,
 *  comment: ...,
 *  metadata: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function createReview(
  options: BaseTransactionOptions<CreateReviewParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x37e30046",
  [
    {
      "internalType": "uint256",
      "name": "requestId",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "reviewerFid",
      "type": "uint256"
    },
    {
      "internalType": "address",
      "name": "reviewee",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "revieweeFid",
      "type": "uint256"
    },
    {
      "internalType": "uint256",
      "name": "rating",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "comment",
      "type": "string"
    },
    {
      "internalType": "bytes",
      "name": "metadata",
      "type": "bytes"
    }
  ],
  []
],
    params: [options.requestId, options.reviewerFid, options.reviewee, options.revieweeFid, options.rating, options.comment, options.metadata]
  });
};


/**
 * Represents the parameters for the "leaveRevieweeComment" function.
 */
export type LeaveRevieweeCommentParams = {
  requestId: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"requestId","type":"uint256"}>
comment: AbiParameterToPrimitiveType<{"internalType":"string","name":"comment","type":"string"}>
};

/**
 * Calls the "leaveRevieweeComment" function on the contract.
 * @param options - The options for the "leaveRevieweeComment" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { leaveRevieweeComment } from "TODO";
 *
 * const transaction = leaveRevieweeComment({
 *  requestId: ...,
 *  comment: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function leaveRevieweeComment(
  options: BaseTransactionOptions<LeaveRevieweeCommentParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x4063f460",
  [
    {
      "internalType": "uint256",
      "name": "requestId",
      "type": "uint256"
    },
    {
      "internalType": "string",
      "name": "comment",
      "type": "string"
    }
  ],
  []
],
    params: [options.requestId, options.comment]
  });
};


