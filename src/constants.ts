import * as url from "node:url";
import * as process from "node:process";
import * as path from "node:path";

export const __dirname = url.fileURLToPath(new url.URL('.', import.meta.url));

export const defaultCSVFileLocation = path.resolve(path.join(process.cwd(), "Transaction_All.csv"));