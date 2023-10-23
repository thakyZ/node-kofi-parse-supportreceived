#!/usr/bin/env node
import { Command } from "commander";
import { searchFile } from "./search.js";

const program = new Command();

program
  .name("kofi-parse-supportreceived")
  .description("parses and searches Ko-Fi support received csv file and returns a link to purchase.")
  .version("1.0.0");

program
  .command("search")
  .description("Search via for a term in the exported CSV file")
  .argument("<search>", "Search term to search in the csv for.")
  .option("-f, --file <path>", "Path to the CSV file. (otherwise searches the current working directory's files.")
  .option("-d, --debug", "Debug the current program.")
  .action(searchFile);

program.parse();