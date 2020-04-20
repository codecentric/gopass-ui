## Releasing and Publishing Gopass UI

This documents the steps it needs to release and publish a new version of Gopass UI to Github.

### In the codebase

1. Let's check if code style and tests are okay: `npm run release:check`. If there are issues, fix them first.
2. Increment the version number in `package.json` and do `npm i` to reflect it within `package-lock.json`.
3. Build the releases for your local platform to verify everything is working: `npm run release`. This takes a while. If successful, the binaries were built in `release/`
4. Build the releases for all other platforms: `./node_modules/.bin/electron-builder --mac dmg --win --linux deb rpm snap AppImage`
5. As we know that everything worked, commit and push the version change

### Draft and public release on Github

1. [Draft a new release](https://github.com/codecentric/gopass-ui/releases/new)
2. Choose the created Git tag.
3. Write a precise but catchy release title. Maybe something about the core topics of this release etc.
4. Describe this release in detail. What features were added or changed? Were bugs fixed? New platforms supported?
5. Attach all binaries for this release from the `release/` directory.
6. Publish and spread the word! 🎉🎉🎉
