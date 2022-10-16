const path = require("path");

module.exports = {
  "*.{js,ts,tsx,jsx,json}": `prettier --write`,
  "*.{js,ts,tsx,jsx}": (filenames) =>
    `next lint --fix --file ${filenames
      .map((f) => path.relative(process.cwd(), f))
      .join(" --file ")}`,
};
