const fs = require('fs')
const chalk = require('chalk')

/**
 * Prints contents with purple background
 *
 * @param {...string} contents - whatever message you wanna print
 *
 * @returns {void} console.log statement
 */
const print = (...contents) => console.log(chalk.bgKeyword('rebeccapurple').white(...contents))

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

const options = ['@logic-warlock', '@logic-warlock/react', '@logic-warlock/typescript']

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
