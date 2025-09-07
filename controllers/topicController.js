import { Topic, SubTopic, User } from '../models/index.js';

export const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 });
    const topicsWithSubTopics = await Promise.all(
      topics.map(async (topic) => {
        const subTopics = await SubTopic.find({ topic: topic._id }).sort({ order: 1 });
        const completedSubTopics = subTopics.filter(subTopic => 
          req.user.completedSubTopics.includes(subTopic._id)
        );
        
        let status = 'Pending';
        if (completedSubTopics.length > 0 && completedSubTopics.length < subTopics.length) {
          status = 'In Progress';
        } else if (completedSubTopics.length === subTopics.length && subTopics.length > 0) {
          status = 'Completed';
        }

        return {
          ...topic.toObject(),
          status,
          subTopics: subTopics.map(subTopic => ({
            ...subTopic.toObject(),
            completed: req.user.completedSubTopics.includes(subTopic._id)
          }))
        };
      })
    );

    res.json(topicsWithSubTopics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleSubTopicComplete = async (req, res) => {
  try {
    const { subTopicId } = req.params;
    const userId = req.user._id;

    const subTopic = await SubTopic.findById(subTopicId);
    if (!subTopic) {
      return res.status(404).json({ message: 'SubTopic not found' });
    }

    const user = await User.findById(userId);
    const isCompleted = user.completedSubTopics.includes(subTopicId);

    if (isCompleted) {
      user.completedSubTopics = user.completedSubTopics.filter(
        id => id.toString() !== subTopicId
      );
    } else {
      user.completedSubTopics.push(subTopicId);
    }

    await user.save();

    res.json({ 
      message: isCompleted ? 'SubTopic marked as incomplete' : 'SubTopic marked as complete',
      completed: !isCompleted
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('completedSubTopics');
    
    const allSubTopics = await SubTopic.find();
    const completedCount = user.completedSubTopics.length;
    const totalCount = allSubTopics.length;

    const levelStats = {
      EASY: { completed: 0, total: 0 },
      MEDIUM: { completed: 0, total: 0 },
      HARD: { completed: 0, total: 0 }
    };

    allSubTopics.forEach(subTopic => {
      levelStats[subTopic.level].total++;
      if (user.completedSubTopics.some(completed => completed._id.toString() === subTopic._id.toString())) {
        levelStats[subTopic.level].completed++;
      }
    });

    const topics = await Topic.find().sort({ order: 1 });
    const topicProgress = await Promise.all(
      topics.map(async (topic) => {
        const subTopics = await SubTopic.find({ topic: topic._id });
        const completedSubTopics = subTopics.filter(subTopic => 
          user.completedSubTopics.some(completed => completed._id.toString() === subTopic._id.toString())
        );
        
        return {
          name: topic.name,
          completed: completedSubTopics.length,
          total: subTopics.length,
          percentage: subTopics.length > 0 ? Math.round((completedSubTopics.length / subTopics.length) * 100) : 0
        };
      })
    );

    res.json({
      overall: {
        completed: completedCount,
        total: totalCount,
        percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
      },
      levelStats,
      topicProgress
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};