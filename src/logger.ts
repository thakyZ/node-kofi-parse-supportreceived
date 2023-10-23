import { bridge } from "./bridge.js";
import chalk from "chalk";

/**
 * @param {[...any[]] | any} message
 */
export function logDebug(message: [...unknown[]] | unknown) {
  if (bridge.debug) {
    console.log(chalk.white("[") + chalk.gray("DBG") + chalk.white("] ") + message);
  }
}

/**
 * @param {[...any[]] | any} message
 */
export function logInformation(message: [...unknown[]] | unknown) {
  if (bridge.debug) {
    console.log(chalk.white("[") + chalk.blueBright("INF") + chalk.white("] ") + message);
  }
}

/**
 * @param {[...any[]] | any} message
 */
export function logError(message: [...unknown[]] | unknown) {
  console.log(chalk.white("[") + chalk.red("INF") + chalk.white("] ") + message);
}

/**
 * @param {[...any[]] | any} message
 */
export function printOutput(message: [...unknown[]] | unknown) {
  console.log(message);
}