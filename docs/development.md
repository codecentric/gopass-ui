## Development

### Prerequisites

- **Node.js 20** (LTS) – use [nvm](https://github.com/nvm-sh/nvm) to install the correct version
- **gopass** – the CLI password manager this UI wraps

### Clone and install dependencies

First, clone the repository and navigate inside:

```bash
git clone https://github.com/codecentric/gopass-ui.git && cd gopass-ui/
```

Then, install the dependencies:

```bash
nvm use # installs/selects the Node version from .nvmrc (20)
npm install
```

### Development

The app is divided into one main process and two renderer processes. One renderer process is for the global search window, the other one for the main explorer window.
All processes have to be started **simultaneously** in different console tabs:

```bash
# run this in a pane for powering the main process (the "backend")
npm run start-main-dev
 # run this in a pane for the renderer of the main/explorer window
npm run start-renderer-explorer-dev
# run this in a pane for the renderer of the search window
npm run start-renderer-search-dev
```

This will start the application with hot-reloading so you can instantly start developing and see the changes in the open application.

### Testing

We use Jest for tests. Currently the project contains unit and integration tests. Unit tests should have no dependency to the local machine except the Node environment we're setting up. Integration tests can also involve system binaries like Gopass, GPG and so on.

Run them with `npm test` and `npm run test:integration`.

### Linting

This project uses **ESLint** (with TypeScript and React plugins) and **Prettier** for code quality and formatting.

**ESLint** checks code quality rules. Configuration is in `.eslintrc.json`. Run it with:

```bash
npm run lint        # check for issues
npm run lint:fix    # auto-fix where possible
```

**Prettier** enforces code formatting. Configuration is in `.prettierrc`. Run it with:

```bash
npm run prettier:check   # check formatting
npm run prettier:write   # auto-format
```

A **Husky** pre-commit hook runs `npm run lint && npm test` automatically before each commit.

### Production packaging

We use [Electron builder](https://www.electron.build/) to build and package the application. See how we use it to package all targeted platforms and formats in [our release docs](./releasing.md).

Packaging will create all results in `releases` folder.
