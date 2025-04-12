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
 * Represents the filters for the "SuggestedAmountAdded" event.
 */
export type SuggestedAmountAddedEventFilters = Partial<{
  completer: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"completer","type":"address"}>
}>;

/**
 * Creates an event object for the SuggestedAmountAdded event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { suggestedAmountAddedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  suggestedAmountAddedEvent({
 *  completer: ...,
 * })
 * ],
 * });
 * ```
 */
export function suggestedAmountAddedEvent(filters: SuggestedAmountAddedEventFilters = {}) {
  return prepareEvent({
    signature: "event SuggestedAmountAdded(address indexed completer, address token, uint256 amount)",
    filters,
  });
};
  

/**
 * Represents the filters for the "SuggestedAmountRemoved" event.
 */
export type SuggestedAmountRemovedEventFilters = Partial<{
  completer: AbiParameterToPrimitiveType<{"indexed":true,"internalType":"address","name":"completer","type":"address"}>
}>;

/**
 * Creates an event object for the SuggestedAmountRemoved event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { suggestedAmountRemovedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  suggestedAmountRemovedEvent({
 *  completer: ...,
 * })
 * ],
 * });
 * ```
 */
export function suggestedAmountRemovedEvent(filters: SuggestedAmountRemovedEventFilters = {}) {
  return prepareEvent({
    signature: "event SuggestedAmountRemoved(address indexed completer, address token)",
    filters,
  });
};
  

/**
* Contract read functions
*/

/**
 * Represents the parameters for the "getSuggestedAmountsByAddress" function.
 */
export type GetSuggestedAmountsByAddressParams = {
  completer: AbiParameterToPrimitiveType<{"internalType":"address","name":"completer","type":"address"}>
};

/**
 * Calls the "getSuggestedAmountsByAddress" function on the contract.
 * @param options - The options for the getSuggestedAmountsByAddress function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getSuggestedAmountsByAddress } from "TODO";
 *
 * const result = await getSuggestedAmountsByAddress({
 *  completer: ...,
 * });
 *
 * ```
 */
export async function getSuggestedAmountsByAddress(
  options: BaseTransactionOptions<GetSuggestedAmountsByAddressParams>
) {
  return readContract({
    contract: options.contract,
    method: [
  "0x6d400293",
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
        }
      ],
      "internalType": "struct FlockInSuggestedPaymentAmounts.SuggestedPaymentAmount[]",
      "name": "",
      "type": "tuple[]"
    }
  ]
],
    params: [options.completer]
  });
};


/**
* Contract write functions
*/

/**
 * Represents the parameters for the "addSuggestedAmount" function.
 */
export type AddSuggestedAmountParams = {
  token: AbiParameterToPrimitiveType<{"internalType":"address","name":"token","type":"address"}>
amount: AbiParameterToPrimitiveType<{"internalType":"uint256","name":"amount","type":"uint256"}>
};

/**
 * Calls the "addSuggestedAmount" function on the contract.
 * @param options - The options for the "addSuggestedAmount" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { addSuggestedAmount } from "TODO";
 *
 * const transaction = addSuggestedAmount({
 *  token: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function addSuggestedAmount(
  options: BaseTransactionOptions<AddSuggestedAmountParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x41ecf188",
  [
    {
      "internalType": "address",
      "name": "token",
      "type": "address"
    },
    {
      "internalType": "uint256",
      "name": "amount",
      "type": "uint256"
    }
  ],
  []
],
    params: [options.token, options.amount]
  });
};


/**
 * Represents the parameters for the "removeSuggestedAmount" function.
 */
export type RemoveSuggestedAmountParams = {
  token: AbiParameterToPrimitiveType<{"internalType":"address","name":"token","type":"address"}>
};

/**
 * Calls the "removeSuggestedAmount" function on the contract.
 * @param options - The options for the "removeSuggestedAmount" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { removeSuggestedAmount } from "TODO";
 *
 * const transaction = removeSuggestedAmount({
 *  token: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function removeSuggestedAmount(
  options: BaseTransactionOptions<RemoveSuggestedAmountParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
  "0x077b0098",
  [
    {
      "internalType": "address",
      "name": "token",
      "type": "address"
    }
  ],
  []
],
    params: [options.token]
  });
};


