const AWS = require('aws-sdk');
const fs = require('fs');
const cron = require('node-cron');
const sqlite3 = require('sqlite3').verbose();

// Configure AWS credentials
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Create S3 instance
const s3 = new AWS.S3();

// Function to backup SQLite database file to S3
function backupDatabaseToS3() {
  const dbFilePath = 'dataStorage.db';
  const backupFileName = 'dataStorage.db'; // Use a consistent backup file name
  const backupKey = `backups/${backupFileName}`;

  // Check if the backup file already exists in S3
  s3.headObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey }, (err, metadata) => {
    if (!err) {
      console.log('Backup file already exists. Overriding...');

      // If the backup file exists, delete it before uploading the new one
      s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey }, (err, data) => {
        if (err) {
          console.error('Error deleting existing backup file:', err);
          return;
        }
        console.log('Existing backup file deleted.');
        uploadBackup();
      });
    } else {
      if (err.code !== 'NotFound') {
        console.error('Error checking if backup file exists:', err);
        return;
      }
      // If the backup file doesn't exist, upload the new one directly
      uploadBackup();
    }
  });

  // Function to upload the backup file to S3
  function uploadBackup() {
    const fileContent = fs.readFileSync(dbFilePath);
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: backupKey,
      Body: fileContent
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading backup:', err);
      } else {
        console.log('Backup uploaded successfully:', data.Location);
      }
    });
  }
}

// Schedule backup to run every Sunday at 1:00 AM
cron.schedule('0 1 * * 0', () => {
  backupDatabaseToS3();
});