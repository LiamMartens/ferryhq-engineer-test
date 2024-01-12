# Setting up the project
## Setup summary
- The project is set-up using [Next.js](https://nextjs.org/) with the app router.
- The code is mainly written in [TypeScript](https://www.typescriptlang.org/).
- For styling, the default [TailwindCSS](https://tailwindcss.com/) configuration is used.
- [Husky](https://typicode.github.io/husky/) is being used to run scripts on commit
- [ESLint](https://eslint.org/) is used to improve code quality
- [Prettier](https://prettier.io/) is used to ensure standardized formatting.  
  *Note: while ESLint can be used for formatting - it is not it's main purpose. Prettier is faster for formatting and deals with a different use case, which is why both are being utilized.*

## Installing dependencies
After cloning the repository you will need to install the dependencies. The project is configured to use [Bun](https://bun.sh/) as it's package manager. If you don't have Bun installed yet you can install it using the link.

Once you have bun available you can simply run `bun install`. This will:
1. Install the required npm dependencies
2. Install husky for Git hooks. (used for linting and formatting on commit)
