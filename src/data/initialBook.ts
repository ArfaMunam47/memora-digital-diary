import { DiaryBook } from '../types/diary';
import { STARTER_TEMPLATES } from './templates';

export const INITIAL_BOOK: DiaryBook = {
  id: 'book-default-01',
  title: 'My Keepsake Journal',
  author: 'Keepsake Creator',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  canvasSize: {
    width: 600,
    height: 780,
  },
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      title: 'Daily Memories',
      background: STARTER_TEMPLATES[0].background,
      elements: STARTER_TEMPLATES[0].elements.map((el, i) => ({
        ...el,
        id: `el-p1-${i + 1}-${Date.now()}`,
      })),
    },
    {
      id: 'page-2',
      pageNumber: 2,
      title: 'Friendship Moments',
      background: STARTER_TEMPLATES[1].background,
      elements: STARTER_TEMPLATES[1].elements.map((el, i) => ({
        ...el,
        id: `el-p2-${i + 1}-${Date.now() + 1}`,
      })),
    },
    {
      id: 'page-3',
      pageNumber: 3,
      title: 'Travel Kyoto',
      background: STARTER_TEMPLATES[2].background,
      elements: STARTER_TEMPLATES[2].elements.map((el, i) => ({
        ...el,
        id: `el-p3-${i + 1}-${Date.now() + 2}`,
      })),
    },
  ],
};
