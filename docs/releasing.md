## Releasing and Publishing Gopass UI

This documents the steps it needs to release and publish a new version of Gopass UI to Github.

### In the codebase

1. Let's check if code style and tests are okay: `npm run release:check`. If there are issues, fix them first.
2. Increment the version number by incrementing patch, minor or major version using `npm version [major | minor | patch]` ([see "npm-version" documentation](https://docs.npmjs.com/cli/version.html)).
3. Build the releases for all supported platforms: `npm run release`. This takes a while. If successful, the binaries were built in `release/`.
4. As we know that everything worked, the Git release commit and tag can be pushed: `git push && git push --tags`.

### Draft and public release on Github

1. [Draft a new release](https://github.com/codecentric/gopass-ui/releases/new)
2. Choose the created Git tag.
3. Write a precise but catchy release title. Maybe something about the core topics of this release etc.
4. Describe this release in detail. What features were added or changed? Were bugs fixed? New platforms supported?
5. Attach all binaries for this release from the `release/` directory.
6. Publish and spread the word! 🎉🎉🎉
