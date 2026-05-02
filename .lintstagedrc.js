const path = require('path')

// `next lint` was removed in Next 16, so we drive ESLint directly against
// the staged files (the flat config lives in eslint.config.mjs).
const buildEslintCommand = (filenames) =>
  `eslint --fix ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}
