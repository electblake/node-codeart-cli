import shelljs from 'shelljs'
import yargs from 'yargs'
import fs from 'fs'
import log from '../logger.mjs'
import { getSnippet, getProfile } from '../profiles.mjs'
import { defaultBuilder } from '../yargs-builders.mjs'

export const command = 'install'
export const desc = 'enable a codeartifact repository on your system'
export const aliases = ['i']
export const builder = defaultBuilder

export const handler = async function (argv) {
  await installShellProfile(argv)
  if (argv.login) {
    await shelljs.exec()
  }
}

/**
 * install codeartifact registry auto-login snippet into profile
 *
 * @param {yargs} argv yargs processed arguments
 * @param {object} params codeartifact parameters
 * @param {string} params.domain name of domain in codeartifact
 * @param {string} params.repository name of register in codeartifact
 * @param {number} params.accountId the aws account id which contains the codeartifact domain
 * @param {string} profile path to your shell profile (relative to your homedir)
 * @returns {void}
 */
async function installShellProfile(argv) {
  if (!argv.profile) {
    throw new Error('profile is required')
  }
  const { filepath, content } = getProfile(argv)
  const snippet = getSnippet(argv)
  if (content.indexOf(snippet.trim()) === -1) {
    const updated = content.split('\n')
    log.debug('installing into..', filepath)
    updated.push(snippet)
    log.preview(updated.join('\n'))
    fs.writeFileSync(filepath, updated.join('\n'))
    log.success('installed.', filepath, 'done')
    log.info(`run \`source ${filepath}\` to login now`)
  } else {
    log.success('already installed', filepath, 'done')
  }
}

/**
 * homebrew install a dependency
 *
 * @param {yargs} argv yargs processed arguments
 * @param {string} name homebrew package to install
 * @returns {boolean} success code
 */
async function installHomebrewPackage(argv, name) {
  log.info(argv, 'home_install..', name)
  // split and shift name incase other args passed into name
  // check if package already installed
  if (!shelljs.which(name.split(' ').shift())) {
    const res = await shelljs.exec(`brew install ${name}`, {
      silent: false,
    })
    if (res.code !== 0) {
      console.error(res.stderr)
      process.exit(1)
    }
    log.success(argv, `${name} installed.`, 'done')
  } else {
    log.success(argv, `${name} already installed.`, 'done')
  }
  return true
}
