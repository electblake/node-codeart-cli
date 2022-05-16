import AWS from 'aws-sdk'
import inquirer from 'inquirer'
import { defaultBuilder } from '../yargs-builders.mjs'
import log from '../logger.mjs'

export const command = 'readme'
export const desc = 'build markdown for your codeartifact registry packages'

export const builder = async (yargs) => {
  await defaultBuilder(yargs)
  yargs.option('namespace', {
    description: 'namespace youd like to write to readme',
  })
  if (yargs.argv.interactive && !yargs.argv.namespace) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'namespace',
        message: 'namespace to output to readme',
      },
    ])
    yargs.default('namespace', answers.namespace.replace('@', ''))
  }
}

async function getPackages(argv, packages = [], nextToken) {
  if (nextToken) {
    log.debug('get packages..', nextToken)
  }
  if (!argv.domain) {
    throw new Error('domain is required')
  }
  if (!argv.account) {
    throw new Error('account is required')
  }
  if (!argv.repository) {
    throw new Error('repository is required')
  }
  if (!argv.namespace) {
    throw new Error('namespace is required')
  }
  const coart = new AWS.CodeArtifact()
  const res = await coart
    .listPackages({
      domain: argv.domain,
      domainOwner: argv.account,
      repository: argv.repository,
      namespace: argv.namespace,
      maxResults: 100,
      format: 'npm',
      nextToken,
    })
    .promise()

  packages = [...packages, ...res.packages.filter((row) => row.namespace === argv.namespace)]
  if (res.nextToken) {
    return getPackages(argv, packages, res.nextToken)
  }

  return packages
}

async function getPackageDetails() {}

export const handler = async function (argv) {
  const packages = await getPackages(argv)
  console.log('packages', packages)

  const markdown = packages.map((row) => {
    return `${row.displayName}`
  })
}
