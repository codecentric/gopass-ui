## Development

### Clone and install dependencies

First, clone the repository and navigate inside:

```bash
git clone https://github.com/codecentric/gopass-ui.git && cd gopass-ui/
```

Then, install the dependencies:

```bash
nvm use # make sure that nvm is installed on your machine and it installs the requested Node version
npm install
```

### Development

The app is divided into two renderer processes. One for the global search window, one for the main explorer window.
All processes have to be started **simultaneously** in different console tabs:

```bash
npm run start-renderer-explorer-dev # for the main/explorer window process
npm run start-renderer-search-dev # for the search window process
npm run start-main-dev # the main process ("backend")
```

This will start the application with hot-reload so you can instantly start developing your application.

You can also run do the following to start both in a single process:

```bash
npm run start-dev
```

### Production packaging

We use [Electron builder](https://www.electron.build/) to build and package the application. By default you can run the following to package for your current platform:

```bash
npm run dist
```

This will create a installer for your platform in the `releases` folder.

You can make builds for specific platforms (or multiple platforms) by using the options found [here](https://www.electron.build/cli). E.g. building for all platforms (Windows, Mac, Linux):

```bash
npm run dist -- -mwl
```
