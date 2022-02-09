const package = require('./package.json');

const messages = [
  `WARNING: ${package.name} v${package.version} is designed for use with one of the following:`,
  ` * @google-cloud/firestore >= 5.0.0 < 6.0.0`,
  ` * firebase >= 9.0.0 < 10.0.0`,
];

messages.forEach(message => {
  console.log('\x1b[33m%s\x1b[0m', message);
});
