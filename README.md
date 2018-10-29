# gopass-ui

### UI for gopass

[Gopass](https://electronjs.org/) is a password manager for the command line written in Golang. This repository, `gopass-ui`, is the UI wrapper for this awesome password manager.

## Install
Clone the repository with Git:

```bash
git clone --depth=1 git@github.com:codecentric/gopass-ui.git
```

And then install the dependencies:

```bash
cd gopass-ui
nvm use
npm install
```

## Usage
Both processes have to be started **simultaneously** in different console tabs:

```bash
npm run start-renderer-dev
npm run start-main-dev
```

This will start the application with hot-reload so you can instantly start developing your application.

You can also run do the following to start both in a single process:

```bash
npm run start-dev
```

## Packaging
We use [Electron builder](https://www.electron.build/) to build and package the application. By default you can run the following to package for your current platform:

```bash
npm run dist
```

This will create a installer for your platform in the `releases` folder.

You can make builds for specific platforms (or multiple platforms) by using the options found [here](https://www.electron.build/cli). E.g. building for all platforms (Windows, Mac, Linux):

```bash
npm run dist -- -mwl
```

## Husky and Prettier
This project comes with both Husky and Prettier setup to ensure a consistent code style. 

To change the code style, you can change the configuration in `.prettierrc`. 

In case you want to get rid of this, you can removing the following from `package.json`:

1. Remove `precommit` from the `scripts` section
1. Remove the `lint-staged` section
1. Remove `lint-staged`, `prettier`, `tslint-config-prettier`, and `husky` from the `devDependencies`

Also remove `tslint-config-prettier` from the `extends` section in `tslint.json`.

## License
MIT
