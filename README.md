# Gopass UI [![Latest release](https://img.shields.io/github/release/codecentric/gopass-ui.svg)](https://github.com/codecentric/gopass-ui/releases/latest)

<img src="docs/img/gopass-ui-logo.png" alt="Gopass UI logo" style="max-width: 800px">

## What is Gopass and Gopass UI?

> [Gopass](https://github.com/gopasspw/gopass) is a rewrite of the pass password manager in Go with the aim of making it cross-platform and adding additional features – (Taken from Github)

`Gopass UI` is wrapping `gopass` from your command line. It makes your life easier by providing a graphical user interface to search and manage your secrets. It looks like this:

<img src="docs/img/demo-720p.gif" alt="GIF demonstrating core features of Gopass UI" title="Gopass UI demo" style="max-width: 720px" />

In addition there is a search window that can be opened with `(cmd || ctrl) + shift + p`.

## How can I use it?

For most platforms just [download the latest packaged application](https://github.com/codecentric/gopass-ui/releases/latest) from our releases and install it. We provide binaries for MacOS, Windows and Linux (deb, RPM, snap, AppImage, Gentoo). For more details see [supported platforms and packages](docs/platforms-and-packages.md).

Of course, you need to have [Gopass](https://github.com/gopasspw/gopass) up and running. We also recommend to use a dialog-based PIN-entry-tool for typing in GPG passphrases like [pinentry-mac for MacOS](https://formulae.brew.sh/formula/pinentry-mac) instead of using the default terminal-based.

### Platform notice

We'll only test the MacOS builds and **are not able to offer support for Linux and Windows releases**. We are happy to review your pull requests addressing any of such issues.  

## Issues and Contribution

Feel free to report any usage issue. We are very keen about your feedback and appreciate any help.
You'd like to help us developing Gopass UI? Awesome! We are looking forward to your pull requests, issues and participation in discussion.

## Development

See how to get started in our [development documentation](docs/development.md).
