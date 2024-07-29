// Database scemha for customer 
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  postcode: { type: String, required: true, maxlength: 6 },
  state: { type: String, required: true },
  city: { type: String, required: true }
});

const customerSchema = new mongoose.Schema({
  pan: { type: String, required: true, unique: true, maxlength: 10 },
  fullName: { type: String, required: true, maxlength: 140 },
  email: { type: String, required: true, maxlength: 255 },
  mobile: { type: String, required: true, maxlength: 10 },
  addresses: { type: [addressSchema], validate: v => Array.isArray(v) && v.length <= 10 }
});

module.exports = mongoose.model('Customer', customerSchema);
