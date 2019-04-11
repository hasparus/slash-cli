/**
 * Wraps string arguments into single quotes on unix
 */
export function makeArgs(...paths: string[]) {
  return paths.map(p => (process.platform === "win32" ? p : `'${p}'`));
}
