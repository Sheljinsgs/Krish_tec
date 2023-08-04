const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  name:{
    type:String,
  },
  contact:{
    type: String,
    required: true
  },
  title:{
    type: String,
    required: true
  },
  company: {
    type: String
  },
  website: {
    type: String
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  bio: {
    type: String
  },
  githubusername: {
    type: String
  },
  experience: [
    {
      title: {
        type: String,
        required: true
      },
      company: {
        type: String,
      },
      location: {
        type: String,
        required: true,
      },
      Years: {
        type: String,
        required: true
      },
      current: {
        type: Boolean,
        default: false
      },
      description: {
        type: String,
        required:true,
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('serviceproviderprofile', ProfileSchema);
