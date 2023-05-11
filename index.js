const express = require ('express');
const mongoose = require ('mongoose');
const multer = require ('multer');
const fileUpload = require ('express-fileupload');

const routes = require ('./routes/routes');
const port = 3000 || 5000;

require ('dotenv').config ();

const DB_CONNECT = process.env.DATABASE_URL;

mongoose.connect (DB_CONNECT);

const database = mongoose.connection;

database.on ('error', e => {
  console.log (error);
});

database.once ('connected', () => console.log ('DB CONNECTED'));

const app = express ();

app.use (express.json ());

app.use ((_, res, req, next) => {
  res.setHeader ('Access-Control-Allow-Origin', '*');
  res.setHeader (
    'Access-Control-Allow-Methods',
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE'
  );
  res.setHeader ('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next ();
});

app.use ('/api', routes);

// Use the express-fileupload middleware
app.use (fileUpload ());

const storage = multer.diskStorage ({
  destination (req, file, callback) {
    callback (null, './images');
  },
  filename (req, file, callback) {
    callback (null, `${file.fieldname}_${Date.now ()}_${file.originalname}`);
  },
});

const upload = multer ({storage});

app.listen (port, () => {
  console.log (`Server started at port ${port}`);
});

module.exports = upload;
