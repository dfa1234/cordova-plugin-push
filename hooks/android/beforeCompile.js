const { join } = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');

module.exports = function (context) {
  if (!isExecutable()) {
    console.log('[cordova-plugin-push::before-compile] skipping before_compile hookscript.');
    return;
  }

  const buildGradleFilePath = join(context.opts.projectRoot, 'platforms/android/build.gradle');

  if (!existsSync(buildGradleFilePath)) {
    console.log('[cordova-plugin-push::before-compile] could not find "build.gradle" file.');
    return;
  }

  updateBuildGradle(context, buildGradleFilePath);
};

/**
 * This hookscript is executable only when the platform version less then 10.x
 * @returns Boolean
 */
function isExecutable () {
  return true;
}

function getPluginKotlinVersion (context) {
  return '1.5.20'
}

function updateBuildGradle (context, buildGradleFilePath) {
  const kotlinVersion = getPluginKotlinVersion(context);
  const updateContent = readFileSync(buildGradleFilePath, 'utf8')
    .replace(/ext.kotlin_version = ['"](.*)['"]/g, `ext.kotlin_version = '${kotlinVersion}'`);

  writeFileSync(buildGradleFilePath, updateContent);

  console.log(`[cordova-plugin-push::before-compile] updated "build.gradle" file with kotlin version set to: ${kotlinVersion}`);
}
