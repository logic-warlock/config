/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const fs = require('fs')
const chalk = require('chalk')
const prompts = require('prompts')

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
const createEslintConfig = async () => {
  console.clear()
  print(chalk.bold("Alright, my dude, let's hook you up with a brand new package."))
  let cancelledByUser = false

  const response = await prompts(
    [
      {
        type: 'multiselect',
        name: 'eslint',
        message: 'What linting do you want?',
        choices: eslintOptions.map((option) => ({ title: option, value: option })),
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
      const eslintConfigPath = `./.eslintrc`

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

  } catch (error) {
    print(chalk.bgRed.white("Well something wasn't used right...", error))
  }
}

;(() => {
  createEslintConfig()
})()
