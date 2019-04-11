const { join, relative } = require("path");
const rimraf = require("rimraf");
const childProcess = require("child_process");
const { promisify } = require("util");
const assert = require("assert");

const { makeArgs } = require("../dist/makeArgs");

const exec = promisify(childProcess.exec);

const execHere = command => exec(`cd ${__dirname} && ${command}`);

async function main() {
  try {
    ["node_modules", "yarn.lock", "../*.tgz"].forEach(s => {
      rimraf.sync(join(__dirname, s));
    });

    const up = join(__dirname, "..");

    await exec(`cd ${up} && yarn pack`);
    let { stdout: lsResult } = await exec(`ls ${up}/*.tgz`);

    const tgzPath = relative(__dirname, lsResult.trim());

    await execHere("cp ./package.template.json ./package.json");
    await execHere("yarn");
    await execHere(`yarn add ${tgzPath}`);

    const testArgs = makeArgs(
      "src\\components\\App.js",
      "src\\components\\Button.js",
      "foobar",
      "one/two"
    );

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
  } finally {
    await execHere("rm ./package.json");
  }
}

main()
  .catch(err => {
    console.error(err);
    process.exit(-1);
  })
  .then(() => {
    process.exit(0);
  });
