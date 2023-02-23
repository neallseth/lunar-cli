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

if (program.opts().full) {
  getFullMoon();
} else {
  getMoonByDate(program.opts().date);
}

async function getMoonByDate(date) {
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

async function getFullMoon() {
  const res = await fetch(`https://www.moongiant.com/`);
  const html = await res.text();

  const root = parse(html);
  const fullMoonDate =
    root.querySelector(".nextCopy > h2").firstChild.innerText;

  console.log(moonPhaseArt["Full Moon"]);
  console.log(chalk.blue.bold(`Next coming full moon will be:\n`));
  console.log(chalk.white.bold(fullMoonDate));
}
