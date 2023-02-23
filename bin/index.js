#!/usr/bin/env node

import { parse } from "node-html-parser";
import chalk from "chalk";
import { table } from "table";
import { Command } from "commander";
import { moonPhaseArt } from "./ascii.js";
const program = new Command();

program.name("moon-cli").description("Moon phase & status CLI application");
program.option("-d, --date <date>");
program.option("-f, --full");

program.parse();

console.log(program.opts());

if (program.opts().full) {
  console.log("show next full moon");
} else {
  pullMoonData(program.opts().date);
}

// const moonVisual = {
//   "New Moon": `    _..._
//   .:::::::.
//  :::::::::::   NEW  MOON
//  :::::::::::
//  \`:::::::::'
//    \`':::''
// `,
//   "Waxing Crescent": `    _..._
//   .::::. \`.
//  :::::::.  :    WAXING CRESCENT
//  ::::::::  :
//  \`::::::' .'
//    \`'::'-'
// `,
//   "First Quarter": `    _..._
//   .::::  \`.
//  ::::::    :    FIRST QUARTER
//  ::::::    :
//  \`:::::   .'
//    \`'::.-'
// `,
//   "Waxing Gibbous": `    _..._
//   .::'   \`.
//  :::       :    WAXING GIBBOUS
//  :::       :
//  \`::.     .'
//    \`':..-'

// `,
//   "Full Moon": `    _..._
//   .'     \`.
//  :         :    FULL MOON
//  :         :
//  \`.       .'
//    \`-...-'
// `,
//   "Waning Gibbous": `    _..._
//   .'   \`::.
//  :       :::    WANING GIBBOUS
//  :       :::
//  \`.     .::'
//    \`-..:''
// `,
//   "Last Quarter": `    _..._
//   .'  ::::.
//  :    ::::::    LAST QUARTER
//  :    ::::::
//  \`.   :::::'
//    \`-.::''
// `,
//   "Waning Crescent": `   _..._
//  .' .::::.
// :  ::::::::    WANING CRESCENT
// :  ::::::::
// \`. '::::::'
//   \`-.::''
// `,
// };

async function pullMoonData(date) {
  const res = await fetch(
    `https://www.moongiant.com/phase/${date ?? "today"}/`
  );
  const html = await res.text();

  const root = parse(html);
  const summary = root.querySelector("#fullDateTitle > p").innerText.trim();
  const moonDetails = root
    .querySelector("#moonDetails")
    .innerText.split("\n")
    .map((detail) => detail.trim())
    .filter((detail) => detail)
    .map((detail) => detail.split(": "));

  const dateObj = date ? new Date(date) : new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  console.log(chalk.white.bold(dateObj.toLocaleDateString("en-US", options)));
  console.log(moonPhaseArt[moonDetails[0][1]]);

  console.log(chalk.blue.bold(`Details`));
  console.log(table(moonDetails));
  console.log(chalk.blue.bold(`\nSummary`));
  const summaryTableConfig = {
    columns: [{ width: 50, wrapWord: true }],
  };

  console.log(table([[summary]], summaryTableConfig));
}
