import AWS from 'aws-sdk'
import inquirer from 'inquirer'
import log from './logger.mjs'
import { getConfiguredRegistry } from './profiles.mjs'

/**
 * build defaults and hints
 *
 * @param {yargs} yargs instance
 * @returns {object} yargs builder object
 */
export const defaultBuilder = async (yargs) => {
  const registry = getConfiguredRegistry()
  yargs.options({
    domain: {
      type: 'string',
      description: 'codeartifact domain name',
      default: registry && registry.domain ? registry.domain : undefined,
    },
    account: {
      type: 'number',
      description: 'AWS Account ID',
      default: registry && registry.account ? registry.account : undefined,
    },
    repository: {
      type: 'string',
      description: 'codeartifact repository name',
      default: registry && registry.repository ? registry.repository : undefined,
    },
    profile: {
      type: 'string',
      description: 'path to shell profile relative to homedir',
      default: '.zshrc',
    },
    region: {
      type: 'string',
      description: 'optional parameter to pass in aws region',
      default: registry && registry.region ? registry.region : undefined,
    },
  })

  yargs.option('interactive', {
    type: 'boolean',
    default: false,
    alias: 'i',
    description: 'interactive mode using aws-sdk *requires* awscli installed and `aws configure`',
  })

  if (yargs.argv.interactive) {
    if (!yargs.argv.region) {
      const selected = await inquirer.prompt([
        {
          type: 'list',
          name: 'region',
          message: 'AWS Region',
          choices: ['us-east-1', 'us-east-2', 'us-west-1', 'us-west-2', 'ca-central-1'],
        },
      ])
      if (selected.region) {
        yargs.default('region', selected.region)
      }
    }
    AWS.config.update({ region: yargs.argv.region })
    log.info(`querying codeartifact (${yargs.argv.region})...`)
    const res = await new AWS.CodeArtifact().listRepositories().promise()
    if (!res || !res.repositories || res.repositories.length === 0) {
      log.error('no repositories found, try a different region or create a repository')
      process.exit(1)
    }
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'selected',
        message: 'Select a repository registered at CodeArtifact',
        choices: () => {
          return res.repositories.map((row) => {
            return {
              name: `${row.name} (${row.domainOwner})`,
              value: row,
            }
          })
        },
      },
    ])

    if (answers.selected) {
      log.info('installing codeartifact repository', answers.selected)
      yargs.default('domain', answers.selected.domainName)
      yargs.default('repository', answers.selected.name)
      yargs.default('account', answers.selected.domainOwner)
    }
  } else {
    AWS.config.update({ region: yargs.argv.region })
  }
}
