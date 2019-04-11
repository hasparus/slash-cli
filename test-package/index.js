const { join, relative } = require("path");
const rimraf = require("rimraf");
const childProcess = require("child_process");
const { promisify } = require("util");
const assert = require("assert");

const exec = promisify(childProcess.exec);

const execHere = command => exec(`cd ${__dirname} && ${command}`);

const packageName = "slash-cli";

async function main() {
  ["node_modules", "yarn.lock", "../*.tgz"].forEach(s => {
    rimraf.sync(join(__dirname, s));
  });

  const up = join(__dirname, "..");

  await exec(`cd ${up} && yarn pack`);
  let { stdout: lsResult } = await exec(`ls ${up}/*.tgz`);

  const tgzPath = relative(__dirname, lsResult.trim());

  await execHere("yarn");
  await execHere(`yarn remove ${packageName}`);
  await execHere(`yarn add ${tgzPath}`);

  const testArgs = [
    "src\\components\\App.js",
    "src\\components\\Button.js",
    "foobar",
    "one/two",
  ];

  result = await execHere(`yarn slash ${testArgs.join(" ")}`);

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
