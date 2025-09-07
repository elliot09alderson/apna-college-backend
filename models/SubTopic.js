import mongoose from 'mongoose';

const subTopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true
  },
  leetcodeLink: {
    type: String,
    required: true,
    trim: true
  },
  youtubeLink: {
    type: String,
    required: true,
    trim: true
  },
  articleLink: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['EASY', 'MEDIUM', 'HARD'],
    required: true
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

subTopicSchema.index({ topic: 1, order: 1 }, { unique: true });

const SubTopic = mongoose.model('SubTopic', subTopicSchema);

export default SubTopic;