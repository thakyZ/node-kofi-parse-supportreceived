import {bridge} from "./bridge.js";

/**
 * @param {{file: string | undefined, debug: boolean}} options
 */
export function setUpBridge(options: {file: string | undefined, debug: boolean}) {
  bridge.debug = options.debug ? true : false;
}

/**
 * @param {string} transactionId
 * @returns {string}
 */
export function generateLink(transactionId: string): string {
  return `https://ko-fi.com/home/coffeeshop?txid=${transactionId}&mode=g&ReturnUrl=/Manage/SupportReceived`;
}