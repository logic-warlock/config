const { execSync } = require('child_process')

// [ ! -f 'file' ] Checks for the existence of the file in the root directory.
// If it is not present one is created, otherwise the line is skipped.
// touch 'file' creates a new file within the root directory
// echo 'text' >> 'file' Adds the 'text' to the end of the 'file'

const commands = [
  '[ ! -f .huskyrc.js ] && touch .huskyrc.js && echo \'module.exports = require("./node_modules/@deseretbook/scripts/husky")\' >> .huskyrc.js',

  '[ ! -f .lintstagedrc.js ] && touch .lintstagedrc.js && echo \'module.exports = require("./node_modules/@deseretbook/scripts/lintstaged")\' >> .lintstagedrc.js',

  '[ ! -f .eslintrc ] && touch .eslintrc && echo \'{\n  "extends": ["@deseretbook"],\n  "plugins": ["prettier"],\n  "rules": {\n    "prettier/prettier": "error"\n  }\n}\' >> .eslintrc',

  '[ ! -f .prettierrc.js ] && touch .prettierrc.js && echo \'module.exports = require("./node_modules/@deseretbook/scripts/prettier")\' >> .prettierrc.js',
]

commands.forEach((command) => {
  try {
    execSync(command)
  } catch (error) {
    console.log(`Failed to run script ${command}.`)
    console.log('Do you already have the file in the root directory?')
  }
})

console.log('Setup is complete!')
