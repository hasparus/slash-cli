"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slash_1 = __importDefault(require("slash"));
const args = process.argv.slice(2);
if (!args[0] || args[0] === "-h" || args[0] === "help") {
    console.log(`
    Usage:
      > slash path\\to\\my\\file
      path/to/my/file
  `);
    process.exit(0);
}
args.forEach(arg => console.log(slash_1.default(arg)));
