const Detox = require('./Detox');
const DetoxConstants = require('./DetoxConstants');
const platform = require('./platform');
const exportWrapper = require('./exportWrapper');
const argparse = require('./utils/argparse');
const configuration = require('./configuration');
const _ = require('lodash');

let detox;

function getDeviceConfig(configurations) {
  const configurationName = argparse.getArgValue('configuration');

  const deviceConfig = (!configurationName && _.size(configurations) === 1)
    ? _.values(configurations)[0]
    : configurations[configurationName];

  if (!deviceConfig) {
    throw new Error(`Cannot determine which configuration to use. use --configuration to choose one of the following:
                      ${Object.keys(configurations)}`);
  }
  if (!deviceConfig.type) {
    configuration.throwOnEmptyType();
  }

  if (!deviceConfig.name) {
    configuration.throwOnEmptyName();
  }

  return deviceConfig;
}

function validateConfig(config) {
  if (!config) {
    throw new Error(`No configuration was passed to detox, make sure you pass a config when calling 'detox.init(config)'`);
  }

  if (!(config.configurations && _.size(config.configurations) >= 1)) {
    throw new Error(`No configured devices`);
  }
}

async function initializeDetox({configurations, session}, params) {
  const deviceConfig = getDeviceConfig(configurations);

  detox = new Detox({deviceConfig, session});
  await detox.init(params);
  platform.set(deviceConfig.type, detox.device);
  process.on('SIGINT', () => detox.shutdown()); // TODO: check if this actually works
}

async function init(config, params) {
  validateConfig(config);
  await initializeDetox(config, params);
}

async function beforeEach(testSummary) {
  if (detox) {
    await detox.beforeEach(testSummary);
  }
}

async function afterEach(testSummary) {
  if (detox) {
    await detox.afterEach(testSummary);
  }
}

async function cleanup() {
    if (detox) {
        await detox.cleanup();
    }
}

module.exports = Object.assign({
  init,
  cleanup,
  beforeEach,
  afterEach,
  DetoxConstants
}, exportWrapper);
