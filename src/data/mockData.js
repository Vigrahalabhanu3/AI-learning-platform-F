export const mockCategories = [
  { id: 'llms', title: 'Large Language Models', icon: 'Brain', count: 12 },
  { id: 'react', title: 'React.js Advanced', icon: 'Code', count: 24 },
  { id: 'python', title: 'Python Mastery', icon: 'Terminal', count: 18 },
  { id: 'rag', title: 'RAG Systems', icon: 'Database', count: 8 },
  { id: 'ml', title: 'Machine Learning', icon: 'Cpu', count: 30 },
  { id: 'ds', title: 'Data Science', icon: 'BarChart', count: 22 },
  { id: 'web', title: 'Web Development', icon: 'Globe', count: 45 },
];

export const mockTopics = [
  {
    id: 't1',
    categoryId: 'react',
    title: 'React Hooks Deep Dive',
    description: 'Master useState, useEffect, and custom hooks.',
    progress: 45,
    videos: [
      { id: 'v1', title: 'Introduction to Hooks', url: 'https://www.youtube.com/watch?v=O6P86uwfdR0', duration: '10:20' },
      { id: 'v2', title: 'useEffect in depth', url: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U', duration: '15:45' }
    ],
    notes: '# Notes on Hooks\n\nHooks allow us to use state and other React features without writing a class.',
    resources: [
      { id: 'r1', type: 'pdf', title: 'Hooks Cheat Sheet' },
      { id: 'r2', type: 'audio', title: 'Podcast: Why Hooks?' }
    ],
    quizzes: [
      {
        id: 'q1',
        question: 'Which hook is used for side effects?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        answer: 1
      }
    ]
  },
  {
    id: 't2',
    categoryId: 'llms',
    title: 'Prompt Engineering 101',
    description: 'Learn how to talk to AI effectively.',
    progress: 0,
    videos: [
      { id: 'v3', title: 'Zero-shot vs Few-shot', url: 'https://www.youtube.com/watch?v=dOxUroR57xs', duration: '12:00' }
    ],
    notes: '',
    resources: [],
    quizzes: []
  }
];
