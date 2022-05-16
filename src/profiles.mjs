import { homedir } from 'os'
import fs from 'fs'
import path from 'path'

/**
 * generate profile snippet
 *
 * @param {object} argv yargs processed arguments
 * @param {string} argv.domain name of domain in codeartifact
 * @param {string} argv.repository name of register in codeartifact
 * @param {number} argv.account the aws account id which contains the codeartifact domain
 * @returns {string} profile snippet
 */
export function getSnippet(argv) {
  if (!argv.domain) {
    throw new Error('domain is required')
  }
  if (!argv.repository) {
    throw new Error('repository is required')
  }
  if (!argv.account) {
    throw new Error('account is required')
  }
  return `\n# codeart-cli auto-login on every shell (token ttl is 12 hours)
aws codeartifact login --tool=npm \\
  --repository=${argv.repository} \\
  --duration-seconds=43200 \\
  --domain=${argv.domain} \\
  --domain-owner=${argv.account}\n`
}

/**
 *
 * @typedef {object} ConfiguredRegistry
 * @property {string} filepath path to shell profile
 * @property {string} content content of shell profile
 */
/**
 * Get registry information already set in npmrc
 *
 * @returns {ConfiguredRegistry|null} configured registry in `~/.npmrc`
 */
export function getConfiguredRegistry() {
  const filepath = path.join(homedir(), '.npmrc')
  if (fs.existsSync(filepath)) {
    const content = fs.readFileSync(filepath, 'utf8').toString()
    const pattern =
      // eslint-disable-next-line max-len
      /registry=https:\/\/([a-z0-9\_\-A-Z]+)-([0-9]+).d.codeartifact.([a-z0-9\-]+).amazonaws.com\/npm\/([a-z0-9A-Z\-\_]+)\//g
    const matches = pattern.exec(content)
    if (matches && matches.length > 1) {
      const [_, domain, account, region, repository] = matches
      if (domain && account && region && repository) {
        return {
          domain,
          account,
          region,
          repository,
        }
      }
    }
  }
  return null
}

/**
 *
 * @typedef {object} ShellProfile
 * @property {string} filepath path to shell profile
 * @property {string} content content of shell profile
 */

/**
 * Read profile file and return content
 *
 * @param {object} argv yargs processed arguments
 * @param {string} argv.profile path to your shell profile (relative to your homedir)
 * @returns {ShellProfile} profile snippet and path to profile
 */
export function getProfile(argv) {
  const filepath = path.join(homedir(), argv.profile)
  const content = fs.readFileSync(filepath).toString()
  return {
    filepath,
    content,
  }
}
