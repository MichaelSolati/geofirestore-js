const fs = require('fs-extra');

fs.copySync('./node_modules/protobufjs', './node_modules/@grpc/proto-loader/node_modules/protobufjs');

