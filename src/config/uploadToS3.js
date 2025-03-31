const AWS = require('aws-sdk');
const dotenv = require('dotenv');

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
// Initialize S3
const s3 = new AWS.S3();
dotenv.config();

/**
 * @returns {Promise<string>} - The URL of the uploaded file
 */
function uploadToS3(req) {
    const file = req.file;
    const fileName = `${Date.now()}_${file.originalname}`;
    const filebuffer = file.buffer;

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME, // Your S3 bucket name
      Key: `images/${fileName}`, // The directory where the file will be stored in S3
      Body: filebuffer,
      ContentType: req.file.mimetype, // Set appropriate MIME type if needed, or derive from file
      ACL: 'public-read', // Make file publicly accessible
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
        return reject('Error uploading file.');
      }
      // Return the URL of the uploaded file
      resolve(data.Location);
    });
  });
}

module.exports = uploadToS3;
