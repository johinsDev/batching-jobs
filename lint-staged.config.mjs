import path from "path"

const buildEslintCommand = (filenames) => {
  return `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`
}

const config = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "bash -c 'bun run check-types'"],
}

export default config
