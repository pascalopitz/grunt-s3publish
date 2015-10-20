var fs = require('fs');
var mime = require('mime');
var AWS = require('aws-sdk');

module.exports = function(grunt) {

  grunt.registerMultiTask('s3publish', function () {

      var done = this.async();
      var taskOptions = this.options();
      var patterns = this.data.replace;
      var allFiles = this.filesSrc;

      var S3 = new AWS.S3({
          accessKeyId: taskOptions.key,
          secretAccessKey: taskOptions.secret,
          region: taskOptions.region,
      });

      var promises = allFiles.map(function(src) {

          if(!grunt.file.isFile(src)) {
              return Promise.resolve('Skipped ' + src);
          }

          return new Promise(function (resolve, reject) {

              var fileData = fs.readFileSync(src);
              var mimeType = mime.lookup(src);

              var key;

              if(patterns) {
                  for(key in patterns) {
                      if(patterns.hasOwnProperty(key)) {
                          src = src.replace(new RegExp(key), patterns[key]);
                      }
                  }
              }

              var options = {
                  Bucket: taskOptions.bucket,
                  Key: src,
                  Body: fileData,
                  ACL: 'public-read',
                  ContentType: mimeType,
              };

              S3.upload(options, function(err, data) {
                  if(err) {
                      return reject(err);
                  }

                  resolve(data.Location);
              });

          });
      });

      Promise.all(promises).then(function(locations) {
          grunt.log.verbose.ok(locations);
          grunt.log.ok('done publishing');
          done();
      }, function (err) {
          grunt.log.error(err, err.stack);
          done(err);
      });
  });

};
