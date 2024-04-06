require('dotenv').config(); // Load environment variables from .env file
const AWS = require('aws-sdk');
const fs = require('fs');
const cron = require('node-cron');
const sqlite3 = require('sqlite3').verbose();
const emailHandler = require('../email/emailTemplate');
const AWSbackupFileName = 'dataStorage.db'; // Backup file name
const AWSDBFilePath = `./config/database/${AWSbackupFileName}`;
const AWSBackupKey = `catchingsouls/${AWSbackupFileName}`;

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
  const dbFilePath = AWSDBFilePath;
  const backupKey = AWSBackupKey;
  emailHandler.sendDatabaseBackupNotification();

  // Check if the backup file already exists in S3
  s3.headObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey }, (err, metadata) => {
    if (!err) {
      console.log('Backup file already exists. Overriding...');

      // If the backup file exists, delete it before uploading the new one
      s3.deleteObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey }, (err, data) => {
        if (err) {
          console.error('Error deleting existing backup file:\n\t', err);
        } else {
          console.log('Existing backup file deleted.');
        }
        uploadBackup();
      });
    } else {
      if (err.code !== 'NotFound') {
        console.error('Error checking if backup file exists:\n\t', err);
      }
      // If the backup file doesn't exist or error occurred, upload the new one directly
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
        sendDatabaseBackupEmailNotification("Unsuccessful", err.message);
      } else {
        console.log('Backup uploaded successfully:', data.Location);
        sendDatabaseBackupEmailNotification("Successful", "");
      }
    });
  }
}

// Function to import backup from S3
function importBackupFromS3() {
  const dbFilePath = AWSDBFilePath;
  const backupKey = AWSBackupKey;
  emailHandler.sendDatabaseImportNotification();

  // Check if the backup file exists in S3
  s3.headObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey }, (err, metadata) => {
    if (err) {
      console.error('Error checking if backup file exists:\n\t', err);
      sendDatabaseImportEmailNotification("Unsuccessful", err.message);
      return;
    }

    // If the backup file exists, download it
    const fileStream = fs.createWriteStream(dbFilePath);
    s3.getObject({ Bucket: process.env.S3_BUCKET_NAME, Key: backupKey })
      .createReadStream()
      .pipe(fileStream);

    fileStream.on('error', (err) => {
      console.error('Error downloading backup file:\n\t', err);
      sendDatabaseImportEmailNotification("Unsuccessful", err.message);
    });

    fileStream.on('finish', () => {
      console.log('Backup file downloaded successfully.');
      sendDatabaseImportEmailNotification("Successful", "");
    });
  });
}

// Function to send email notification
function sendDatabaseBackupEmailNotification(status, logs) {
  emailHandler.sendDatabaseBackupResultsNotification(status, logs);
}

function sendDatabaseImportEmailNotification(status, logs) {
  emailHandler.sendDatabaseImportResultsNotification(status, logs);
}

// Schedule backup to run every Sunday at 12:00 AM
cron.schedule('0 0 * * 0', () => {
  backupDatabaseToS3();
});

// Schedule backup to run every Wednesday at 12:00 AM
cron.schedule('0 0 * * 3', () => {
  backupDatabaseToS3();
});

module.exports = {
  importBackupFromS3
};