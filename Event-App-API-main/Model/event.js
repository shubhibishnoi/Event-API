const mongoose = require('mongoose');
const session = require('express-session');

const eventSchema = new mongoose.Schema({
  creatorID: String,
  title: String,
  date: String,
  des: String,
  invites: {
    type: Array,
    default: []
  }
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
