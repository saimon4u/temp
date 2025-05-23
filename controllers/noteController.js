import Note from '../models/Note.js';
import cloudinaryConfig from '../config/cloudinary.js';

const { cloudinary } = cloudinaryConfig;

class NoteController {
  static async uploadNote(req, res) {
    try {
      console.log('Received upload request:', {
        body: req.body,
        file: req.file
      });
      const { title, category, description } = req.body;
      const file = req.file;

      if (!file) {
        console.log('No file uploaded');
        return res.status(400).json({ error: 'No file uploaded' });
      }

      console.log('Full req.file:', JSON.stringify(req.file, null, 2));

      const result = {
        secure_url: req.file.secure_url || req.file.url || req.file.path,
        asset_id: req.file.public_id || req.file.asset_id || `baust_lecture_notes/${Date.now()}_${file.originalname}`
      };

      console.log('Cloudinary Result:', result);

      if (!result.secure_url || !result.asset_id) {
        console.error('Missing Cloudinary fields:', result);
        return res.status(500).json({ error: 'Failed to retrieve Cloudinary upload details' });
      }

      const note = new Note({
        title,
        category,
        description,
        pdfUrl: result.secure_url,
        assetId: result.asset_id
      });

      await note.save();
      console.log('Note saved to MongoDB:', note._id);
      res.status(201).json({ message: 'Note uploaded successfully', noteId: note._id });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllNotes(req, res) {
    try {
      const notes = await Note.find();
      res.status(200).json(notes);
    } catch (error) {
      console.error('Get all notes error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async getNote(req, res) {
    try {
      const note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json(note);
    } catch (error) {
      console.error('Get note error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async updateNote(req, res) {
    try {
      const { title, category, description } = req.body;
      const note = await Note.findByIdAndUpdate(
        req.params.id,
        { title, category, description },
        { new: true }
      );
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json({ message: 'Note updated successfully', note });
    } catch (error) {
      console.error('Update note error:', error);
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteNote(req, res) {
    try {
      const note = await Note.findById(req.params.id);
      if (!note) {
        console.log('Note not found:', req.params.id);
        return res.status(404).json({ error: 'Note not found' });
      }
      console.log('Deleting Cloudinary asset:', note.assetId);
      await cloudinary.uploader.destroy(note.assetId, { resource_type: 'raw' });
      console.log('Cloudinary asset deleted:', note.assetId);
      await Note.findByIdAndDelete(req.params.id);
      console.log('Note deleted from MongoDB:', req.params.id);
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Delete note error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export default NoteController;