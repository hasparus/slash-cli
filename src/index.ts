#! /usr/bin/env node
import slash from "slash";

const args = process.argv.slice(2);

if (!args[0] || args[0] === "-h" || args[0] === "help") {
  console.log(`
    Usage:
      > slash path\\to\\my\\file
      path/to/my/file
  `);
  process.exit(0);
}

args.forEach(arg => console.log(slash(arg)));
