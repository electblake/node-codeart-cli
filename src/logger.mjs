import chalk from 'chalk'

/**
 * print error to log
 *
 * @param  {...any} args mirrors interface of console.log
 */
export function error(...args) {
  console.error('!', chalk.red('err'), ...args)
}

/**
 * print info to log
 *
 * @param  {...any} args mirrors interface of console.log
 */
export function info(...args) {
  console.info('.', chalk.cyan.dim('info'), ...args)
}

/**
 * print warn to log
 *
 * @param  {...any} args mirrors interface of console.log
 */
export function warn(...args) {
  console.warn(chalk.yellow('! warn'), ...args)
}

/**
 * print success to log
 *
 * @param  {...any} args mirrors interface of console.log
 */
export function success(...args) {
  console.log(chalk.green('✓ ok'), ...args)
}

/**
 * print debug to log
 *
 * @param  {...any} args mirrors interface of console.log
 */
export function debug(...args) {
  console.log('.', chalk.grey('debug'), ...args)
}

/**
 * preview content logger
 *
 * @param {string} updated content to be written
 * @param {number} [limit=5] number of lines to preview
 */
export function preview(updated, limit = 10) {
  updated = updated.trim().split('\n')
  if (updated.length - limit >= 0) {
    debug('<preview>', updated.length - limit, 'lines above...')
    process.stdout.write([...updated.slice(-limit)].join('\n') + '\n')
  } else {
    debug('<preview>')
    process.stdout.write(updated.join('\n') + '\n')
  }
  debug('</preview>')
}

export default {
  success,
  error,
  info,
  warn,
  debug,
  preview,
}
