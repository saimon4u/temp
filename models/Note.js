import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  pdfUrl: { type: String, required: true },
  assetId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Note', noteSchema);