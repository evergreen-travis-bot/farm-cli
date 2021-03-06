'use strict'

const getFarmArgs = require('../bin/get-farm-args')
const should = require('should')

describe('get farm args', function () {
  it('default config', function () {
    const config = getFarmArgs([])

    should(config.flags).be.eql({
      maxCallsPerWorker: Infinity,
      maxConcurrentWorkers: require('os').cpus().length,
      maxConcurrentCallsPerWorker: 1,
      maxConcurrentCalls: Infinity,
      maxCallTime: Infinity,
      maxRetries: Infinity,
      autoStart: true,
      delayBetweenWorkers: 1000
    })
  })

  describe('custom config', function () {
    describe('exact name', function () {
      describe('number', function () {
        const value = 999
        ;[
          'maxCallsPerWorker',
          'maxConcurrentWorkers',
          'maxConcurrentCallsPerWorker',
          'maxConcurrentCalls',
          'maxCallTime',
          'maxRetries',
          'delayBetweenWorkers'
        ].forEach(function (arg) {
          it(arg, function () {
            const config = getFarmArgs([`--${arg}=${value}`])
            should(config.flags[arg]).be.equal(value)
          })
        })
      })

      describe('boolean', function () {
        const value = false
        ;[
          'autoStart'
        ].forEach(function (arg) {
          it(arg, function () {
            const config = getFarmArgs([`--no-${arg}`])
            should(config.flags[arg]).be.equal(value)
          })
        })
      })
    })

    describe('using alias', function () {
      describe('number', function () {
        const value = 999
        ;[
          ['d', 'delayBetweenWorkers'],
          ['n', 'maxConcurrentWorkers'],
          ['w', 'maxConcurrentCallsPerWorker'],
          ['r', 'maxRetries']
        ].forEach(function (arg) {
          const [alias, name] = arg

          it(`${alias} for ${name}`, function () {
            const config = getFarmArgs([`-${alias}`, value])
            should(config.flags[name]).be.equal(value)
          })
        })
      })

      describe('boolean', function () {
        const value = false
        ;[
          ['autostart', 'autoStart']
        ].forEach(function (arg) {
          const [alias, name] = arg
          it(`${alias} for ${name}`, function () {
            const config = getFarmArgs([`--no-${alias}`])
            should(config.flags[name]).be.equal(value)
          })
        })
      })
    })
  })
})
