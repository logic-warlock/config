#!/usr/bin/env node
/**
 * This scripts file is heavily influenced by react-scripts.
 * @see https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/bin/react-scripts.js
 */
'use strict'

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (error) => {
  throw error
})

const yargs = require('yargs')
const spawn = require('cross-spawn')

yargs
  .command('<script>', 'Run a db scripts command', (yargs) => {
    yargs.positional('script', {
      describe: 'Name of script to run',
      type: 'string',
    })
  })
  .help()

const argv = yargs.argv
const argsList = argv._

const validScripts = ['setup']

const scriptIndex = argsList.findIndex((arg) => validScripts.includes(arg))

const script = argsList[scriptIndex]
const nodeArgs = scriptIndex > 0 ? argsList.slice(0, scriptIndex) : []

if (!script) {
  console.log(
    [
      'Unknown script provided.',
      'Valid script are: ' + validScripts.join(', '),
    ].join('\n'),
  )

  return
}

console.log('RUNNING SCRIPT _______', script, argsList)

const result = spawn.sync(
  'node',
  nodeArgs
    .concat(require.resolve('../scripts/' + script))
    .concat(argsList.slice(scriptIndex + 1)),
  { stdio: 'inherit' },
)

if (result.signal) {
  if (result.signal === 'SIGKILL') {
    console.log(
      [
        'The build failed because the process exited too early.',
        'This probably means the system ran out of memory or someone called `kill -9` on the process.',
      ],
      join('\n'),
    )
  } else if (result.signal === 'SIGTERM') {
    console.log(
      [
        'The build failed because the process exited too early.',
        'Someone might have called `kill` or `killall`, or the system could be shutting down.',
      ].join('\n'),
    )
  }

  process.exit(1)
}

process.exit(result.status)

console.log('HELLO WORLD', args)
