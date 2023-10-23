import * as process from "node:process";
import chalk from "chalk";
import {defaultCSVFileLocation} from "./constants.js";
import {logError, printOutput} from "./logger.js";
import {CSVFile} from "./parse_csv.js";
import {generateLink, setUpBridge} from "./utils.js";

/**
 *
 * @param {string} searchTerm
 * @param {{file: string | undefined, debug: boolean}} options
 */
async function searchFileAsync(searchTerm: string, options: {file: string | undefined, debug: boolean}) {
  /** @type {CSVFile} */
  const file: CSVFile = new CSVFile(options.file ? options.file : defaultCSVFileLocation);

  /** @type {Error | boolean | undefined} */
  const returnData: Error | boolean | undefined = await file.awaitUntilReady();
  if (file.isErrored()) {
    logError(returnData);
    process.exit(1);
    return;
  }

  /** @type {string[][] | undefined} */
  const data: string[][] | undefined = file.getRecords;
  if (typeof data === "undefined") {
    logError("data received was typeof undefined.");
    process.exit(1);
    return;
  }

  /** @type {string[][] | undefined} */
  const searched: string[][] | undefined = data.filter((value, index) => {
    /** @type {string[] | string | undefined} */
    const purchases: string[] | string | undefined = value[3].includes("Product:") ? value[3].split(/(?: \| )?Product: \d x /) : value[3];
    if (Array.isArray(purchases) && typeof purchases !== "string" && typeof purchases !== "undefined") {
      return purchases.some((x) => x.includes(searchTerm));
    } else if (!Array.isArray(purchases) && typeof purchases === "string" && typeof purchases !== "undefined") {
      return purchases.includes(searchTerm);
    } else if (!Array.isArray(purchases) && typeof purchases !== "string" && typeof purchases === "undefined") {
      logError(`CSV Index of ${index} returned type of "undefined" when searching`);
      return false;
    } else {
      return false;
    }
  });

  if (typeof searched === "undefined") {
    logError("searched data was typeof undefined.");
    process.exit(1);
  }

  for (const results of searched) {
    printOutput(chalk.greenBright(results[3].replaceAll(/(?: \| )?Product: \d x /g, "")) + chalk.white(" : ") + chalk.blueBright(generateLink(results[12])));
  }
}

/**
 *
 * @param {string} searchTerm
 * @param {{file: string, debug: boolean}} options
 */
export function searchFile(searchTerm: string, options: {file: string, debug: boolean}) {
  setUpBridge(options);
  searchFileAsync(searchTerm, options);
}