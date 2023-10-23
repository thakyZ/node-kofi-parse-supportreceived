import * as fs from "node:fs";
import * as readline from "node:readline";
import * as csv from "csv";
import {logDebug} from "./logger.js";
import chalk from "chalk";
import { parser } from "csv";

type Parser = parser.Parser | undefined;

type PromiseResolve<T> = (value: T) => void;
type PromiseReject = (reason?: unknown) => void;

export class CSVFile {
  /** @type {Parser | undefined} */
  private parser: Parser | undefined = undefined;
  /** @type {string[][]} */
  private records: string[][] = [];
  /** @type {boolean} */
  private ready: boolean = false;
  /** @type {boolean} */
  private errored: boolean = false;
  /** @type {Error | unknown | undefined} */
  private errorInstance: Error | unknown | undefined = undefined;

  /**
   * @param {string} filePath
   */
  constructor(filePath: string) {
    if (typeof this.parser !== "undefined") {
      throw new Error(`The CSV Parser is already initalized typeof "${this.parser}".`);
    }

    this.parser = csv.parse({
      delimiter: ",",
    });

    if (typeof this.parser === "undefined") {
      throw new Error(`The CSV Parser failed to initalize.`);
    }

    this.parser.on("readable", () => {
      let record;
      if (typeof this.parser === "undefined") {
        return;
      }
      while ((record = this.parser.read()) !== null) {
        this.records.push(record);
      }
    });

    this.parser.on("error", (error: Error | unknown | undefined) => {
      this.errorInstance = error;
      this.ready = true;
      this.errored = true;
    });

    this.parser.on("end", () => {
      this.ready = true;
    });

    (async () => {
      await this.loadRecords(filePath);
    })();
  }

  /**
   * @returns {string[][] | undefined}
   */
  public get getRecords(): string[][] | undefined {
    if (this.ready && !this.errored) {
      return this.records;
    } else {
      return undefined;
    }
  }

  /**
   * @returns {Promise<Error | boolean | undefined>}
   */
  async awaitUntilReady(): Promise<Error | boolean | undefined> {
    const poll = (resolve: PromiseResolve<Error | boolean | undefined>, reject: PromiseReject) => {
      if (this.ready && !this.errored) {
        resolve(true);
      } else if (this.ready && this.errored) {
        reject(this.errorInstance);
      } else {
        setTimeout(() => poll(resolve, reject), 400)
      }
    };

    return new Promise<Error | boolean | undefined>(poll);
  }

  /**
   * @returns {boolean}
   */
  isErrored(): boolean {
    return this.errored;
  }

  /**
   *
   * @param {fs.PathLike} filePath
   * @returns {Promise<boolean>}
   */
  async loadRecords(filePath: fs.PathLike): Promise<boolean> {
    return new Promise<boolean>((resolve: PromiseResolve<boolean>, reject: PromiseReject) => {
      (async () => {
        let fileStream: fs.ReadStream;
        let rl: readline.promises.Interface;
        try {
          /** @type {fs.ReadStream} */
          fileStream = fs.createReadStream(filePath, { encoding: "utf-8", flags: "r+", autoClose: true });
        } catch(error) {
          reject(error);
          return;
        }
        try {
          /** @type {readline.promises.Interface} */
          rl = readline.promises.createInterface({
            input: fileStream,
            crlfDelay: Infinity
          });
        } catch(error) {
          reject(error);
          return;
        }
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break.
        try {
          if (typeof this.parser === "undefined") {
            reject(new Error("CSVFile parser is uninitialized."));
            return;
          }

          for await (const line of rl) {
            logDebug("Writing line:\n    " + chalk.blueBright(`${line}`) + chalk.greenBright("\\n") + chalk.reset(""));
            this.parser.write(`${line}\n`);
          }
          this.parser.end();
        } catch (error) {
          reject(error);
          return;
        }

        resolve(true);
      })();
    });
  }
}