import path from "path"

const buildEslintCommand = (filenames) => {
  return `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`
}

const buildPrettierCommand = (filenames) => {
  return `prettier --write ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" ")}`
}

const config = {
  "*.{js,jsx,ts,tsx}": [
    buildPrettierCommand,
    buildEslintCommand,
    "bash -c 'pnpm run types:check'",
  ],
}

export default config
