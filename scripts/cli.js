/* eslint-disable @typescript-eslint/no-var-requires, no-console */
const prompts = require('prompts')
const figlet = require('figlet')
const chalk = require('chalk')
const childProcess = require('child_process')

/**
 * Prints contents with purple background
 *
 * @param {...string} contents - whatever message you wanna print
 *
 * @returns {void} console.log statement
 */
const print = (...contents) => console.log(chalk.bgKeyword('rebeccapurple').white(...contents))

/**
 * Prints header information when the CLI starts. Because we can, that's why.
 */
const printWelcomeMessage = () => {
  print(
    chalk.bold(
      figlet.textSync('Welcome to the Logic Warlock CLI!', {
        width: 80,
        horizontalLayout: 'default',
        verticalLayout: 'full',
        whitespaceBreak: true,
      }),
    ),
  )
}

/**
 * This is the main hub for taking actions within the monorepo.
 *
 * This should be called at the end of every action. The only exception is for sub-menus.
 */
const mainMenu = async (message = '') => {
  console.clear()
  printWelcomeMessage()

  const response = await prompts({
    type: 'select',
    name: 'action',
    message: [message, 'What would you like to do?'].filter(Boolean).join('\n'),
    choices: [{ title: 'Setup Environment', value: 'setupEnvironment' }],
  })

  switch (response.action) {
    case 'setupEnvironment': {
      const environmentProcess = childProcess.fork('./scripts/setupEnvironment.js')

      // This will restart the main menu when we finish building the package
      environmentProcess.on('exit', () => {
        mainMenu()
      })

      break
    }

    case undefined: {
      // Exits CLI when user hits CTRL + C
      return
    }

    default: {
      mainMenu(`${response.action} wasn't recognized.`)
    }
  }
}

/**
 * This is like the main thing. This is where the cli runs.
 */
;(() => {
  mainMenu()
})()
