const package = require('./package.json');

const messages = [
  `WARNING: ${package.name} v${package.version} is designed for use with one of the following:`,
  ` * @google-cloud/firestore ${package.optionalDependencies['@google-cloud/firestore']}`,
  ` * firebase ${package.optionalDependencies['firebase']}`,
];

messages.forEach(message => {
  console.log('\x1b[33m%s\x1b[0m', message);
});
