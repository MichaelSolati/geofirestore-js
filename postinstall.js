const package = require('./package.json');

const messages = [
  `WARNING: ${package.name} v${package.version} is incompatiable with versions of this library prior to v4.0.0.`,
  `Visit https://github.com/MichaelSolati/geofirestore-js#upgrading for more information about how to upgrade your collections.`,
];

messages.forEach(message => {
  console.log('\x1b[33m%s\x1b[0m', message);
});
