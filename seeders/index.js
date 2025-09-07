import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Topic, SubTopic } from '../models/index.js';
import connectDB from '../config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Topic.deleteMany({});
    await SubTopic.deleteMany({});

    const users = await User.insertMany([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123'
      }
    ]);

    const topics = await Topic.insertMany([
      { name: 'Algorithms', order: 1 },
      { name: 'Data Structures', order: 2 },
      { name: 'Databases', order: 3 },
      { name: 'Machine Learning', order: 4 },
      { name: 'Operating Systems', order: 5 },
      { name: 'Networks', order: 6 }
    ]);

    const algorithmsSubTopics = [
      {
        name: 'Sorting Algorithms',
        topic: topics[0]._id,
        leetcodeLink: 'https://leetcode.com/tag/sorting/',
        youtubeLink: 'https://youtube.com/watch?v=sorting',
        articleLink: 'https://example.com/sorting',
        level: 'EASY',
        order: 1
      },
      {
        name: 'Searching Algorithms',
        topic: topics[0]._id,
        leetcodeLink: 'https://leetcode.com/tag/binary-search/',
        youtubeLink: 'https://youtube.com/watch?v=search',
        articleLink: 'https://example.com/searching',
        level: 'EASY',
        order: 2
      },
      {
        name: 'Dynamic Programming',
        topic: topics[0]._id,
        leetcodeLink: 'https://leetcode.com/tag/dynamic-programming/',
        youtubeLink: 'https://youtube.com/watch?v=dp',
        articleLink: 'https://example.com/dp',
        level: 'MEDIUM',
        order: 3
      },
      {
        name: 'Greedy Algorithms',
        topic: topics[0]._id,
        leetcodeLink: 'https://leetcode.com/tag/greedy/',
        youtubeLink: 'https://youtube.com/watch?v=greedy',
        articleLink: 'https://example.com/greedy',
        level: 'MEDIUM',
        order: 4
      },
      {
        name: 'Divide and Conquer',
        topic: topics[0]._id,
        leetcodeLink: 'https://leetcode.com/tag/divide-and-conquer/',
        youtubeLink: 'https://youtube.com/watch?v=divide',
        articleLink: 'https://example.com/divide',
        level: 'MEDIUM',
        order: 5
      },
      {
        name: 'Backtracking',
        topic: topics[0]._id,
        leetcodeLink: 'https://leetcode.com/tag/backtracking/',
        youtubeLink: 'https://youtube.com/watch?v=backtrack',
        articleLink: 'https://example.com/backtrack',
        level: 'HARD',
        order: 6
      }
    ];

    const dataStructuresSubTopics = [
      {
        name: 'Arrays',
        topic: topics[1]._id,
        leetcodeLink: 'https://leetcode.com/tag/array/',
        youtubeLink: 'https://youtube.com/watch?v=arrays',
        articleLink: 'https://example.com/arrays',
        level: 'EASY',
        order: 1
      },
      {
        name: 'Linked Lists',
        topic: topics[1]._id,
        leetcodeLink: 'https://leetcode.com/tag/linked-list/',
        youtubeLink: 'https://youtube.com/watch?v=linkedlist',
        articleLink: 'https://example.com/linkedlist',
        level: 'MEDIUM',
        order: 2
      },
      {
        name: 'Stacks and Queues',
        topic: topics[1]._id,
        leetcodeLink: 'https://leetcode.com/tag/stack/',
        youtubeLink: 'https://youtube.com/watch?v=stack',
        articleLink: 'https://example.com/stack',
        level: 'MEDIUM',
        order: 3
      },
      {
        name: 'Trees',
        topic: topics[1]._id,
        leetcodeLink: 'https://leetcode.com/tag/tree/',
        youtubeLink: 'https://youtube.com/watch?v=trees',
        articleLink: 'https://example.com/trees',
        level: 'MEDIUM',
        order: 4
      },
      {
        name: 'Graphs',
        topic: topics[1]._id,
        leetcodeLink: 'https://leetcode.com/tag/graph/',
        youtubeLink: 'https://youtube.com/watch?v=graphs',
        articleLink: 'https://example.com/graphs',
        level: 'HARD',
        order: 5
      }
    ];

    await SubTopic.insertMany([...algorithmsSubTopics, ...dataStructuresSubTopics]);

    const allSubTopics = await SubTopic.find();
    
    users[0].completedSubTopics = [allSubTopics[0]._id, allSubTopics[5]._id];
    await users[0].save();

    users[1].completedSubTopics = [allSubTopics[0]._id, allSubTopics[1]._id, allSubTopics[6]._id];
    await users[1].save();

    console.log('Database seeded successfully!');
    console.log('Users created:');
    console.log('- john@example.com (password: password123)');
    console.log('- jane@example.com (password: password123)');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();