# Config

This package allows an easy setup for a dev environment.

# Installation

You can install this package with npm.

```
npm install @logic-warlock/config
```

Or with Yarn.

```
yarn add @logic-warlock/config
```

# Setup

Once installed you need to create or update several files.

## Linting

This project comes with several `@logic-warlock` eslint configs.

- [@logic-warlock/eslint-config](https://github.com/logic-warlock/eslint-config) - For General JavaScript
- [@logic-warlock/eslint-config-react](https://github.com/logic-warlock/eslint-config-react) - For React
- [@logic-warlock/eslint-config-typescript](https://github.com/logic-warlock/eslint-config-typescript) - For TypeScript

Now you just need to extend these packages from within a `.eslintrc` file.

```
{
  "extends": ["@logic-warlock", "@logic-warlock/react", "@logic-warlock/typescript"]
}
```

If you are using `@logic-warlock/eslint-config-typescript` then you will also need to specify a parser.

```
{
  "parser": "@typescript-eslint/parser"
}
```

You will also need to specify a `parserOptions` parameter that has a nested `project` that points to a `.tsconfig` file. For example the `.eslintrc` file would look something like:

```
{
  "extends": ["@logic-warlock", "@logic-warlock/react", "@logic-warlock/typescript"],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": './tsconfig'
  }
}
```

If you don't have a `.tsconfig` file you can run `tsc --init` to generate one. You must already have TypeScript installed.

## Environment

### Prettier

Just create a `.prettierrc` file and add:

```
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "jsxBracketSameLine": false,
  "jsxSingleQuote": false,
  "printWidth": 100,
  "quoteProps": "as-needed",
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all",
  "useTabs": false
}
```

### Git-Hooks

To get git Hooks working properly you'll need to create a few files within your root directory.

#### husky.json

Add the following to your `husky.json` file. This will run any commands you list within lint-staged, and the apply conventional commits to your staged commits. You can add any additional commands to the hooks file. The command for `prepare-commit-msg` is used in order for commitizen to run properly.

```
{
  "hooks": {
    "pre-commit": "lint-staged",
    "prepare-commit-msg": "exec < /dev/tty && git cz --hook || true"
  }
}
```

#### lintstaged.json

Add the following to your `lintstaged.json` file. This will run prettier, and lint your code before it gets committed. These commands will be run within `.js, .jsx, .ts, and .tsx` files. You can edit or add any commands within this file.

```
{
  "*.{js,jsx,ts,tsx}": [
    "prettier --write --ignore-path .gitignore",
    "git add",
    "eslint . --ignore-path .gitignore"
  ]
}
```

#### commitizen

Add the following to your `commitizen.json` file. This path just specifies, well, the path to initiate commitizen.

```
{
 "path": "cz-conventional-changelog"
}
```

Some cool minor change
