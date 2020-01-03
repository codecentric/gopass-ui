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

The app is divided into one main process and two renderer processes. One renderer process is for the global search window, the other one for the main explorer window.
All processes have to be started **simultaneously** in different console tabs:

```bash
# don't forget nvm use && npm install from the previous section ;-)

# run this in a pane for powering the main process (the "backend")
npm run start-main-dev
 # run this in a pane for the renderer of the main/explorer window
npm run start-renderer-explorer-dev
# run this in a pane for the renderer of the search window
npm run start-renderer-search-dev
```

This will start the application with hot-reloading so you can instantly start developing and see the changes in the open application.

### Testing

We use Jest for tests. Currently the project contains (too less) unit and integration tests. Unit tests should have no dependency to the local machine except the Node environment we're setting up. Integration tests can also involve system binaries like Gopass, GPG and so on – you got the point ;-)

Run them with `npm test` and `npm run test:integration`.


### Linting

This project contains `prettier` and `tslint`. **TLDR:** Prettier assists during development. Tslint is ran in a Husky pre-commit hook together with unit tests and in the Travis CI pipeline (see `.travis.yml`).

**Prettier** is more aggressive because it is designed opinionated. It will find and correct more . The only options we decide on are to be found in `.prettierrc`. We use Prettier to enforce and apply code style during development process. Right after saving an edited file it will correct code style mistakes! In VSCode this comes with the Prettier extension already. In JetBrains IntelliJ IDEA/Webstorm [this can be easily configured](https://prettier.io/docs/en/webstorm.html). On the CLI, feel free to use `npm run prettier:check` and `npm run prettier:write`.

**Tslint** is used to check the code style baseline before commiting staged code and while running CI. Feel free to use the scripts `npm run lint` for linting and `npm run lint:fix` for fixing simple issues automatically to make code comply to the baseline style.


### Production packaging

We use [Electron builder](https://www.electron.build/) to build and package the application. By default you can run the following to package for your current platform:

```bash
npm run release
```

This will create a installer for your platform in the `releases` folder.

You can make builds for specific platforms (or multiple platforms) by using the options found [here](https://www.electron.build/cli). E.g. building for all platforms (Windows, Mac, Linux):

```bash
npm run release -- -mwl
```
