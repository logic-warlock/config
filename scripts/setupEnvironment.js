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
const prettier = require('./config/prettier.json')
const husky = require('./config/husky.json')
const lintStaged = require('./config/lintstaged.json')
const commitizen = require('./config/commitizen.json')

// List of configurations.
const configurations = [
  { title: 'Prettier', value: '.prettier.json' },
  { title: 'Husky', value: '.husky.json' },
  { title: 'Lint-Staged', value: '.lintstaged.json' },
  { title: 'Commitizen', value: '.commitizen.json' },
]
const eslintOptions = ['@logic-warlock', '@logic-warlock/react', '@logic-warlock/typescript']

/**
 * Prints contents with purple background
 *
 * @param {...string} contents - whatever message you wanna print
 *
 * @returns {void} console.log statement
 */
const print = (...contents) => console.log(chalk.bgKeyword('rebeccapurple').white(...contents))

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
        choices: configurations.map(({ title, value }) => ({ title, value })),
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

    if (response.eslint && response.eslint.length) {
      print(`Awesome! ${chalk.bold('Linting')}. I love linting, I got you.`)
      const eslintConfigPath = `${__dirname}/.eslintrc`

      // Creates a .eslintrc file if one cannot be found
      if (!fs.existsSync(eslintConfigPath)) {
        print(chalk.bold('Adding .eslintrc to the root directory'))
        fs.writeFileSync(eslintConfigPath, JSON.stringify({ extends: [] }))
      }

      // Grabs file contents
      const eslintConfig = fs.readFileSync(eslintConfigPath, { encoding: 'utf-8' })

      // Parses file contents so that we can interact with it
      const parsedConfig = JSON.parse(eslintConfig)

      const options = response.eslint

      if (parsedConfig) {
        // Adds ENV options for Browser and Node
        parsedConfig.env = { browser: true, node: true }

        // Sets up extends
        const extend = parsedConfig.extends || []

        options.forEach((option) => {
          if (!extend.includes(option)) {
            extend.push(option)
          }
        })

        parsedConfig.extends = extend

        // Checks if typescript linting should be added
        if (options.includes('@logic-warlock/typescript')) {
          // Sets the parser option to @typescript-eslint/parser if not already set
          if (!parsedConfig.parser) {
            parsedConfig.parser = '@typescript-eslint/parser'
          } else {
            print('I noticed you already have a parser set')
            print("I'm assuming you know better than I do")
          }

          // Adds parser options, but doesn't set the tsconfig path
          // This is required for some of the eslint rules
          if (!parsedConfig.parserOptions) {
            // TODO: Add option to create tsconfig file
            parsedConfig.parserOptions = { project: 'ADD YOUR TSCONFIG PATH HERE' }
            print('Please add the tsconfig path to your eslint file')
          }
        }
      } else {
        print(chalk.bold('Something went wrong... We were unable to update your eslint config'))
        print('Check the documentation for how to add linting manually')
      }

      fs.writeFileSync(eslintConfigPath, JSON.stringify(parsedConfig))

      print(chalk.bold('Eslint has been setup! Congrats!'))
    }

    if (response.configs && response.configs.length) {
      print(`Sweet, dude. ${chalk.bold('Configs')}. I love configs. I got you.`)
      response.configs.forEach((config) => {
        const configPath = `${__dirname}/${config}`

        // Creates a .eslintrc file if one cannot be found
        if (!fs.existsSync(configPath)) {
          print(chalk.bold(`Adding ${config} to the root directory`))
          fs.writeFileSync(configPath, JSON.stringify({}))
        }

        // Checks what config has been selected and writes the corresponding file contents
        if (config.includes('prettier')) {
          fs.writeFileSync(configPath, JSON.stringify(prettier))
        } else if (config.includes('husky')) {
          fs.writeFileSync(configPath, JSON.stringify(husky))
        } else if (config.includes('lintstaged')) {
          fs.writeFileSync(configPath, JSON.stringify(lintStaged))
        } else if (config.includes('commitizen')) {
          fs.writeFileSync(configPath, JSON.stringify(commitizen))
        } else {
          print(`${config} is not a valid option. No files created.`)
        }
      })
    }
  } catch (error) {
    print(chalk.bgRed.white("Well something wasn't used right...", error))
  }
}

;(() => {
  createPackage()
})()
