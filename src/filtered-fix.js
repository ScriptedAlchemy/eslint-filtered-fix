const CLIEngine = require('eslint').CLIEngine;

/**
 * Creates a fixing function or boolean that can be provided as eslint's `fix`
 * option.
 *
 * @param  {Object|boolean} options Either an options object, or a boolean
 * @return {Function|boolean}       `fix` option for eslint
 */
function makeFixer(options) {
  if (!options) {
    return false;
  }

  if (typeof options === 'boolean') {
    return options;
  }

  const rulesToFix = options.rules;

  if (rulesToFix) {
    return function (eslintMessage) {
      if (rulesToFix.includes(eslintMessage.ruleId)) {
        return true;
      }
      return false;
    };
  }

  // Fallback
  return false;
}

function getEslintCli(options) {
  return new CLIEngine(options);
}

function calculateFixes(files, eslintCli) {
  return eslintCli.executeOnFiles(files);
}

function applyFixes(report) {
  CLIEngine.outputFixes(report);
}

function fix(files, fixOptions, eslintOptions) {
  // Ensure files are an array
  let fileList = [].concat(files);

  const fixFunc = makeFixer(fixOptions);
  const cliOptions = Object.assign({}, eslintOptions, {fix: fixFunc});
  const eslintCli = getEslintCli(cliOptions);
  const report = calculateFixes(fileList, eslintCli);
  applyFixes(report);

  // Re-run eslint to get new report
  return calculateFixes(fileList, eslintCli);
}


module.exports = {
  fix,
  makeFixer,
};