const mongoose = require ('mongoose');

const staffSchema = new mongoose.Schema ({
  hotelName: {
    required: true,
    type: String,
  },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: Number,
  },
  passport: {
    required: true,
    type: String,
  },
  position: {
    required: true,
    type: String,
  },
  salary: {
    required: true,
    type: Number,
  },
  address: {
    required: true,
    type: String,
  },
  state: {
    required: true,
    type: String,
  },
  promoted: {
    required: true,
    type: Boolean,
  },
  comments: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model ('Staff', staffSchema);
