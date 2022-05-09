import shelljs from 'shelljs'
import yargs from 'yargs'
import fs from 'fs'
import path from 'path'
import { homedir } from 'os'
import log from '../logger.mjs'
import { getSnippet, getProfile } from '../profiles.mjs'
import { defaultBuilder } from '../yargs-builders.mjs'

export const command = 'uninstall'
export const aliases = ['u', 'remove', 'destroy']
export const desc = 'remove all codeartifact repositories installed your system'
export const builder = defaultBuilder
export const handler = async function (argv) {
  await removeProfileSnippet(argv)
  await removeNpmrc(argv)
}

/**
 * uninstall codeartifact registry auto-login into profile
 *
 * @param {object} argv yargs processed arguments
 * @param {string} argv.domain name of domain in codeartifact
 * @param {string} argv.repository name of register in codeartifact
 * @param {number} argv.account the aws account id which contains the codeartifact domain
 * @param {string} argv.profile path to your shell profile (relative to your homedir)
 * @returns {void}
 */
export async function removeProfileSnippet(argv) {
  const { filepath, content } = getProfile(argv)
  const snippet = getSnippet(argv)
  if (content.indexOf(snippet.trim()) >= 0) {
    log.info('removing from', filepath)
    const updated = content.replace(snippet, '').split('\n')
    log.preview(updated.join('\n'))
    fs.writeFileSync(filepath, updated.join('\n').trim())
    log.success('removed codeartifact registry autologin snippet', filepath, 'done')
  } else {
    log.success('codeartifact registry autologin not installed', filepath, 'done')
  }
}

/**
 * remove npmrc configuration for codeartifact effecticely is __aws codeartifact logout__
 *
 * @param {yargs} argv yargs processed arguments
 * @returns {void}
 */
export async function removeNpmrc(argv) {
  const npmrc = path.join(homedir(), '.npmrc')
  // remove per https://aws.amazon.com/blogs/devops/publishing-private-npm-packages-aws-codeartifact/
  await shelljs.exec(`npm config delete registry`)
  log.info('cleaning npmrc..', npmrc)
  const content = fs
    .readFileSync(npmrc)
    .toString()
    .split('\n')
    .filter((line) => {
      return (
        line.indexOf('codeartifact') === -1 && line.indexOf(argv.account) === -1 && line.indexOf(argv.region) === -1
      )
    })

  if (content.length > 0) {
    log.preview(content.join('\n'), 10)
    fs.writeFileSync(npmrc, content.join('\n'))
    log.success('npmrc cleaned.', 'done')
  } else {
    log.success('npmrc already clean.', 'done')
  }
}
