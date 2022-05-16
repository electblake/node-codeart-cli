import log from '../logger.mjs'
import { getConfiguredRegistry } from '../profiles.mjs'
import { defaultBuilder } from '../yargs-builders.mjs'
import AWS from 'aws-sdk'

export const command = 'status'
export const desc = 'get current configured registry and token status'
export const aliases = ['doctor']
export const builder = defaultBuilder

export const handler = async function (argv) {
  const registry = getConfiguredRegistry()
  if (registry) {
    log.success('registry installed', registry)
  } else {
    log.warn('registry not installed', `run \`${argv.$0} install --interactive\` to configure`)
  }

  if (!argv.region) {
    log.warn('region was not provided, cannot check codeartifact connection', 'use --region <string> to specify')
  } else {
    const coart = new AWS.CodeArtifact()
    const res = await coart.listRepositories().promise()
    if (res && res.repositories && res.repositories.length > 0) {
      log.success('repositories available', res.repositories.length)
    }
  }
}
