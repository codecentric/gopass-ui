# gopass-ui

### UI for gopass

[Gopass](https://github.com/gopasspw/gopass) is a password manager for the command line written in Golang. This repository, `gopass-ui`, is the UI wrapper for this awesome password manager.

## Install
Clone the repository with Git:

```bash
git clone git@github.com:codecentric/gopass-ui.git
```

And then install the dependencies:

```bash
cd gopass-ui
nvm use
npm install
```

## Usage
The app is divided into two renderer processes. One for the global search window, one for the main explorer window.
All processes have to be started **simultaneously** in different console tabs:

```bash
npm run start-renderer-app-dev # for the main-app process
npm run start-renderer-search-dev # for the search-app process
npm run start-main-dev # the main process
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

## Contributors

| [<img alt="Jonas Verhoelen" src="https://avatars1.githubusercontent.com/u/6791360?v=4&s=200" width="200">](https://github.com/jverhoelen) | [<img alt="Matthias Rütten" src="https://avatars1.githubusercontent.com/u/2926623?v=4&s=200" width="200">](https://github.com/ruettenm) |
:---: | :---:
|[Jonas Verhoelen](https://github.com/jverhoelen) | [Matthias Rütten](https://github.com/ruettenm)|

## License
MIT
