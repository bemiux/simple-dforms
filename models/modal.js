const { Schema, model } = require('mongoose');

module.exports = model('modals', 
  new Schema({
    gid: { type: String },
    logs: { type: String, default: null },
    fid: { type: String, default: 'custom-modal' },
    q1: { type: String, default: 'Question #1' },
    q2: { type: String, default: 'Question #2' },
    q3: { type: String, default: 'Question #3' },
    submitters: { type: Array }
  })
)