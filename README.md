# Setting up the project

## Setup summary

- The project is set-up using [Next.js](https://nextjs.org/) with the app router.
- The code is mainly written in [TypeScript](https://www.typescriptlang.org/).
- For styling, the default [PandaCSS](https://panda-css.com/) configuration is used.
- [Husky](https://typicode.github.io/husky/) is being used to run scripts on commit
- [ESLint](https://eslint.org/) is used to improve code quality
- [Prettier](https://prettier.io/) is used to ensure standardized formatting.  
  _Note: while ESLint can be used for formatting - it is not it's main purpose. Prettier is faster for formatting and deals with a different use case, which is why both are being utilized._
- [Storybook](https://storybook.js.org/) is used in conjunction with [Chromatic](https://www.chromatic.com/) for UI testing.
- [Vitest](https://vitest.dev/) is used for unit testing

## Installing dependencies

After cloning the repository you will need to install the dependencies. The project is configured to use [Bun](https://bun.sh/) as it's package manager. If you don't have Bun installed yet you can install it using the link.

Once you have bun available you can simply run `bun install`. This will:

1. Install the required npm dependencies
2. Install husky for Git hooks. (used for linting and formatting on commit)

## Configuring environment variables

You will need to configure the following environment variables as needed:
| Name | Description |
|----|----|
| `CHROMATIC_PROJECT_TOKEN` | Only required if you intend to publish to chromatic locally |

## Running the project

For UI development you can run `bun run storybook` to start the Storybook server. To run the project itself you will need to run `bun run dev`
