const { join } = require("path");
const rimraf = require("rimraf");
const childProcess = require("child_process");
const { promisify } = require("util");
const assert = require("assert");

const exec = promisify(childProcess.exec);

async function main() {
  ["node_modules", "yarn.lock", "../*.tgz"].forEach(s => {
    rimraf.sync(join(__dirname, s));
  });

  const up = join(__dirname, "..");

  await exec(`cd ${up} && yarn pack`);
  let { stdout: lsResult } = await exec(`ls ${up}/*.tgz`);

  await exec(`cd ${__dirname} && yarn add ${lsResult.trim()}`);

  const testArgs = [
    "src\\components\\App.js",
    "src\\components\\Button.js",
    "foobar",
    "one/two",
  ];

  result = await exec(`cd ${__dirname} && yarn slash ${testArgs.join(" ")}`);

  assert.strictEqual(result.stderr, "", "stderr is not empty");

  const actual = result.stdout
    .split("\n")
    .filter(Boolean)
    .slice(-testArgs.length);

  assert.deepStrictEqual(actual, [
    "src/components/App.js",
    "src/components/Button.js",
    "foobar",
    "one/two",
  ]);
}

main()
  .catch(err => {
    console.error(err);
    process.exit(-1);
  })
  .then(() => {
    process.exit(0);
  });
