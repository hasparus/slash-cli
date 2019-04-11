import childProcess from "child_process";
import { promisify } from "util";

const exec = promisify(childProcess.exec);

beforeAll(async () => {
  await exec("yarn build");
});

describe("cli", () => {
  const run = (args: string) => exec("node dist/index.js " + args);

  it("converts backslashes to forward slashes", async () => {
    const args =
      process.platform === "win32"
        ? "src\\components\\App.js src\\components\\Button.js"
        : "'src\\components\\App.js' 'src\\components\\Button.js'";

    const { stdout } = await run(args);

    expect(stdout).toBe("src/components/App.js\nsrc/components/Button.js\n");
  });

  it("lets args without backslashes pass", async () => {
    const { stdout } = await run("lorem/ipsum dolorSitAmet");

    expect(stdout).toBe("lorem/ipsum\ndolorSitAmet\n");
  });

  it("shows help", async () => {
    const argsForHelp = ["-h", "help", ""];

    await Promise.all(
      argsForHelp.map(async arg => {
        const { stdout } = await run(arg);

        expect(stdout.includes("Usage")).toBe(true);
      })
    );
  });
});
