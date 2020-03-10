const replace = require('replace-in-file');
const git = require('git-rev-sync');
const herokuSourceVersion = process.env.SOURCE_VERSION || '';
const buildVersion = herokuSourceVersion.slice(0,7) || git.short(); // Heroku or git
const environment = process.argv[2];
const options = {
  files: './src/environments/environment.' + environment + '.ts',
  from: /{BUILD_VERSION}/g,
  to: buildVersion,
  allowEmptyPaths: false,
};

try {
  let changedFiles = replace.sync(options);
  console.log('Modified files', changedFiles.join(', '));
  console.log('Build version set: ' + buildVersion);
}
catch (error) {
  console.error('Error occurred:', error);
}
