const fs = require('fs')

const eslintConfig = fs.readFileSync(`${__dirname}/.eslintrc`, { encoding: 'utf-8' })

console.log(JSON.parse(eslintConfig))
