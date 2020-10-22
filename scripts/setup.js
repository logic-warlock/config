const commands = [
  // '[ ! -f .huskyrc.js ] && touch .huskyrc.js && echo \'module.exports = require("@logic-warlock/scripts/husky")\' >> .huskyrc.js',
  // '[ ! -f .lintstagedrc.js ] && touch .lintstagedrc.js && echo \'module.exports = require("@logic-warlock/scripts/lintstaged")\' >> .lintstagedrc.js',
  // '[ ! -f .eslintrc ] && touch .eslintrc && echo \'{\n  "extends": ["@logic-warlock"],\n  "plugins": ["prettier"],\n  "rules": {\n    "prettier/prettier": "error"\n  }\n}\' >> .eslintrc',
  // '[ ! -f .prettierrc.js ] && touch .prettierrc.js && echo \'module.exports = require("@logic-warlock/scripts/prettier")\' >> .prettierrc.js',
  // `[ ! -f .czrc ] && touch .czrc && echo '${commitizen}' >> .czrc`,
]

console.log('Setup is complete!')

/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const prompts = require('prompts')
const childProcess = require('child_process')
const chalk = require('chalk')
const fs = require('fs')
const path = require('path')

//Configuration Files
const prettier = require('./prettier.json')
const husky = require('./husky.json')
const lintStaged = require('./lintstaged.json')
const commitizen = require('./commitizen.json')

// List of configurations.
const configurations = ['Prettier', 'Husky', 'Lint-Staged', 'Commitizen']
const eslintOptions = ['React', 'TypeScript']

/**
 * Prints contents with purple background
 *
 * @param {...string} contents - whatever message you wanna print
 *
 * @returns {void} console.log statement
 */
const print = (...contents) => console.log(chalk.bgKeyword('rebeccapurple').white(...contents))

/**
 * Adds initial package content
 *
 * @returns {string} export for hello world function
 */
const buildSrcIndexContents = () => `
export const helloWorld = () => console.log('So help me you better delete this.')
`

/**
 * Asks the dev a series of questions and then generates a new package based on it.
 */
const createPackage = async () => {
  console.clear()
  print(chalk.bold("Alright, my dude, let's hook you up with a brand new package."))
  let cancelledByUser = false

  const response = await prompts(
    [
      {
        type: 'multiselect',
        name: 'eslint',
        message: 'What linting do you want applied?',
        choices: eslintOptions.map((option) => ({ title: option, value: option })),
      },
      {
        type: 'multiselect',
        name: 'configs',
        message: 'What configurations do you want applied?',
        choices: configurations.map((config) => ({ title: config, value: config })),
      },
    ].filter(Boolean),
    {
      onCancel: () => {
        cancelledByUser = true
      },
    },
  )

  if (cancelledByUser) {
    print('No problemo! Come back anytime.')

    return
  }

  try {
    print(chalk.bold('Say no more, fam.'))
    print(
      `Making a legit folder for the package at ${chalk.bold(
        path.join(packagesPath, response.name),
      )}`,
    )
    fs.mkdirSync(path.join(packagesPath, response.name))

    print(`Building a super sick ${chalk.bold('package.json')} file for ya.`)
    fs.writeFileSync(
      path.join(packagesPath, response.name, 'package.json'),
      buildPackageJsonContents(response),
    )

    print(`Finna make a place for you to dump your code now too.`)
    fs.mkdirSync(path.join(packagesPath, response.name, 'src'))
    fs.writeFileSync(
      path.join(packagesPath, response.name, 'src', 'index.ts'),
      buildSrcIndexContents(),
    )

    if (response.eslint && response.eslint.length) {
      print(`Awesome! ${chalk.bold('Linting')}. I love linting, I got you.`)
      const eslintConfig = fs.readFileSync(`${__dirname}/.eslintrc`)
    }

    if (response.configs && response.configs.length) {
      print(`Sweet, dude. ${chalk.bold('Dependencies')}. I love dependencies. I got you.`)
      response.dependencies.forEach((dependency) => {
        childProcess.execSync(
          `lerna add @deseretbook/${dependency} --no-bootstrap --scope=@deseretbook/${response.name}`,
        )
      })
    }

    print('Making sure all the packages are going to play nice together.')
    childProcess.execSync(`lerna bootstrap`)
  } catch (error) {
    print(chalk.bgRed.white('Well wtf.', error))
  }
}

;(() => {
  createPackage()
})()
