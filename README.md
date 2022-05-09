# codeart-cli
auto-login to your codeartfact registry for npm

## Features
- Installs codeartifact auto-login snippet to your shell of choice (ie. `~/.zshrc`)
- Uninstall codeartifact auto-login from your shell
- Remove codeartifact registry (and all related codeartifact) from `~/.npmrc`)
- Interactive mode utilizes aws-sdk to easily setup whatever codeartifact registry you wish
- Uses ECMAScript modules and jsdoc instead of TypeScript
- Requires Node 14+

### Requirements

**This tool uses ECMAScript Modules, so node 14 or greater is required**
## Install

```bash
npm i -g codeart-cli
```


## Usage

```bash
codeart --help
```

### Recommended
```bash
codeart install --interactive
codeart uninstall --interactive
```