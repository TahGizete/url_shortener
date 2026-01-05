import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
  urlCode: String,     // The 6-character ID (e.g., xK92bL)
  longUrl: String,     // The original link
  shortUrl: String,    // The full shortened link
  date: { type: String, default: Date.now }
});

export default mongoose.model('Url', urlSchema);