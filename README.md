# Gopass UI [![Build Status](https://travis-ci.org/codecentric/gopass-ui.svg?branch=master)](https://travis-ci.org/codecentric/gopass-ui) [![Latest release](https://img.shields.io/github/release/codecentric/gopass-ui.svg)](https://github.com/codecentric/gopass-ui/releases/latest) [![Snyk vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/codecentric/gopass-ui.svg)](https://github.com/codecentric/gopass-ui/releases/latest) [![David Dependencies Status](https://david-dm.org/codecentric/gopass-ui.svg)](https://david-dm.org/codecentric/gopass-ui)

<img src="docs/gopass-ui-logo.png" alt="Gopass UI logo" style="max-width: 800px">

## What is Gopass and Gopass UI?

> [Gopass](https://github.com/gopasspw/gopass) is a rewrite of the pass password manager in Go with the aim of making it cross-platform and adding additional features – (Taken from Github)

The repository you're currently looking at contains `Gopass UI`, an Electron based UI wrapper for your `gopass` on the command line. It makes your life easier by providing a rich graphical user interface to search and manage your secrets. It looks like this:

<img src="docs/demo-720p.gif" alt="GIF demonstrating core features of Gopass UI" title="Gopass UI demo" style="max-width: 800px" />

In addition there is a globally usable search window that can be opened with `(cmd || ctrl) + shift + p`.

## How can I use it?

For most platforms just [download the latest packaged application](https://github.com/codecentric/gopass-ui/releases/latest) from our releases and install it. We support binaries for MacOS, Windows and Linux (deb, RPM, Gentoo). For more details see [supported platforms and packages](docs/platforms-and-packages.md).

Of course, you need to have [Gopass](https://github.com/gopasspw/gopass) up and running already. We also recommend you to use a dialog-based PIN-entry-tool for typing in your GPG passphrase like [pinentry-mac for MacOS](https://formulae.brew.sh/formula/pinentry-mac) instead of using the default terminal-based.

## Issues

Please report any issues and problems to us. We are very keen about your feedback and appreciate any help.

## Development

See how to get started with development [here](docs/development.md).

## Contribution

You'd like to help us? No problem. We are looking forward to your pull requests, issues and participation in discussion.

| [<img alt="Jonas Verhoelen" src="https://avatars1.githubusercontent.com/u/6791360?v=4&s=200" width="200">](https://github.com/jverhoelen) | [<img alt="Matthias Rütten" src="https://avatars1.githubusercontent.com/u/2926623?v=4&s=200" width="200">](https://github.com/ruettenm) |
:---: | :---:
|[Jonas Verhoelen](https://github.com/jverhoelen) | [Matthias Rütten](https://github.com/ruettenm)|

## License
MIT
