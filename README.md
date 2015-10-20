#grunt-s3publish

     s3publish: {
         options: {
             key: config.AWS_KEY,
             secret: config.AWS_SECRET,
             region: config.AWS_REGION,
             bucket: config.S3_WEBSITE_BUCKET,
         },
         public: {
             replace: {
                 '^public/': ''
             },
             src: ['public/**/*']
         }
     }
