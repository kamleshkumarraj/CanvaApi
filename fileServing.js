const express = require('express');
const fs = require('fs');
const path = require('path');

const app = require('./app.js');
const multer = require('multer');

// Middleware to serve and delete the image
app.get('/images/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'public/images', req.params.filename);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, (err) => {
      if (!err) {
        // Delete the image after sending
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log(`${req.params.filename} deleted from server.`);
          }
        });
      } else {
        console.error('Error sending file:', err);
      }
    });
  } else {
    res.status(404).send('File not found');
  }
});




