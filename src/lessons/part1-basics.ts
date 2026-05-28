import type { Lesson } from '../types';
import { hasColumns } from './validators';

export const basicsLessons = {
  welcome: {
    id: 'welcome',
    moduleId: 'basics',
    emoji: '🏠',
    title: "Welcome to Annie's Dog Park",
    subtitle: 'Your first peek at data',
    minutes: 5,
    story: [
      'You help run a little **dog park** — and **Annie** is the star of the show!',
      'Every dog has a profile card, and every treat has a price tag.',
      'Behind the scenes, all that info lives in **tables** — like spreadsheets that talk to each other.',
      'You do not need to memorize anything yet. Just explore!',
    ],
    concepts: [
      { term: 'Table', plain: 'A grid of information (rows and columns).' },
      { term: 'Row', plain: 'One record — one dog or one treat.' },
      { term: 'Column', plain: 'One kind of detail — name, age, breed.' },
    ],
    task: 'Click **Run** on the query already in the box to see all the dogs. No typing required!',
    starterQuery: 'SELECT * FROM dogs;',
    hints: [
      'The query is already filled in — just press Run.',
      'You should see five dogs in the results table.',
    ],
    exploreQueries: [
      'SELECT * FROM dogs;',
      'SELECT * FROM treats;',
      'SELECT * FROM dog_treats;',
    ],
    validate: (_rows, columns) => {
      if (columns.length >= 4 && _rows.length === 5) {
        return { ok: true, message: 'You just read your first table. Annie would be proud!' };
      }
      return { ok: false, message: 'Run SELECT * FROM dogs; to see every dog.' };
    },
  },

  'select-all': {
    id: 'select-all',
    moduleId: 'basics',
    emoji: '👀',
    title: 'See Everything',
    subtitle: 'SELECT and FROM',
    minutes: 8,
    story: [
      'To ask the computer for data, you write a **query**.',
      '**SELECT** means “show me.” **FROM** means “which table.”',
      'The star `*` means “every column.”',
    ],
    concepts: [
      { term: 'SELECT', plain: 'Pick what to show.' },
      { term: 'FROM', plain: 'Which table to read.' },
      { term: '*', plain: 'All columns at once.' },
    ],
    exampleQuery: 'SELECT * FROM treats;',
    exampleCaption: 'Every treat in the jar.',
    task: 'Write a query that shows **all columns** from the **treats** table.',
    starterQuery: 'SELECT ',
    hints: ['SELECT * FROM treats;', 'End with a semicolon ;'],
    solutionQuery: 'SELECT * FROM treats;',
    validate: (rows, columns) => {
      if (hasColumns(columns, ['name', 'flavor', 'price']) && rows.length === 4) {
        return { ok: true, message: 'Perfect! You asked for the whole treats menu.' };
      }
      if (rows.length > 0 && !hasColumns(columns, ['flavor'])) {
        return { ok: false, message: 'Read from treats, not dogs.' };
      }
      return { ok: false, message: 'Use SELECT * FROM treats;' };
    },
  },

  'select-columns': {
    id: 'select-columns',
    moduleId: 'basics',
    emoji: '🎯',
    title: 'Pick What You Need',
    subtitle: 'Choosing columns',
    minutes: 8,
    story: [
      'Sometimes you only need a few columns — not the whole table.',
      'List column names separated by commas instead of `*`.',
    ],
    concepts: [{ term: 'Column list', plain: 'name, age — only those fields return.' }],
    exampleQuery: 'SELECT name, breed FROM dogs;',
    exampleCaption: 'Names and breeds only.',
    task: 'Show **name** and **favorite_toy** for every dog.',
    starterQuery: 'SELECT ',
    hints: ['SELECT name, favorite_toy FROM dogs;', 'favorite_toy has an underscore.'],
    solutionQuery: 'SELECT name, favorite_toy FROM dogs;',
    validate: (rows, columns) => {
      const lower = columns.map((c) => c.toLowerCase());
      if (
        lower.length === 2 &&
        lower.includes('name') &&
        lower.includes('favorite_toy') &&
        rows.length === 5
      ) {
        return { ok: true, message: 'Nice — just the columns you asked for!' };
      }
      return { ok: false, message: 'Try: SELECT name, favorite_toy FROM dogs;' };
    },
  },

  where: {
    id: 'where',
    moduleId: 'basics',
    emoji: '🔍',
    title: 'Find the Right Ones',
    subtitle: 'WHERE filters',
    minutes: 10,
    story: [
      'You only want dogs **younger than 4**.',
      '**WHERE** keeps rows that match a rule.',
    ],
    concepts: [
      { term: 'WHERE', plain: 'Filter rows.' },
      { term: 'age < 4', plain: 'Compare numbers with <, >, =' },
    ],
    exampleQuery: "SELECT name, age FROM dogs WHERE breed = 'labrador';",
    exampleCaption: 'Only Buddy appears.',
    task: 'List **name** and **age** for dogs **younger than 4**.',
    starterQuery: 'SELECT name, age FROM dogs WHERE ',
    hints: ['age < 4', 'SELECT name, age FROM dogs WHERE age < 4;'],
    solutionQuery: 'SELECT name, age FROM dogs WHERE age < 4;',
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name', 'age'])) {
        return { ok: false, message: 'Select name and age.' };
      }
      const names = rows.map((r) => r[0]?.toLowerCase()).sort().join(',');
      if (names === 'buddy,daisy,rocky' && rows.length === 3) {
        return { ok: true, message: 'You found the young pups!' };
      }
      if (rows.length === 5) {
        return { ok: false, message: 'Add WHERE age < 4 to narrow it down.' };
      }
      return { ok: false, message: 'Use WHERE age < 4.' };
    },
  },

  'order-by': {
    id: 'order-by',
    moduleId: 'basics',
    emoji: '📊',
    title: 'Put Them in Order',
    subtitle: 'Sorting',
    minutes: 10,
    story: [
      'Sort treats from **cheapest to most expensive** with **ORDER BY**.',
      '**ASC** means ascending (low to high).',
    ],
    concepts: [
      { term: 'ORDER BY', plain: 'Sort results.' },
      { term: 'ASC', plain: 'Smallest first.' },
    ],
    exampleQuery: 'SELECT name, price FROM treats ORDER BY price ASC;',
    exampleCaption: 'Beef Minis should be first.',
    task: 'Show treat **name** and **price**, cheapest first.',
    starterQuery: 'SELECT name, price FROM treats ORDER BY ',
    hints: ['ORDER BY price ASC'],
    solutionQuery: 'SELECT name, price FROM treats ORDER BY price ASC;',
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name', 'price']) || rows.length !== 4) {
        return { ok: false, message: 'Need name, price, and four treats.' };
      }
      const prices = rows.map((r) => parseFloat(r[1] ?? '0'));
      const sorted = [...prices].sort((a, b) => a - b);
      if (prices.every((p, i) => p === sorted[i]) && prices[0] === 2.99) {
        return { ok: true, message: 'Sorted perfectly!' };
      }
      return { ok: false, message: 'Add ORDER BY price ASC.' };
    },
  },

  count: {
    id: 'count',
    moduleId: 'basics',
    emoji: '🔢',
    title: 'How Many?',
    subtitle: 'COUNT(*)',
    minutes: 10,
    story: [
      'How many dogs are at the park? Use **COUNT(*)** to count rows.',
    ],
    concepts: [{ term: 'COUNT(*)', plain: 'Counts how many rows match.' }],
    exampleQuery: 'SELECT COUNT(*) AS total FROM dogs;',
    exampleCaption: 'AS names the result column.',
    task: 'Count how many **dogs** there are. Name the column **total**.',
    starterQuery: 'SELECT COUNT(*) AS total FROM ',
    hints: ['FROM dogs', 'SELECT COUNT(*) AS total FROM dogs;'],
    solutionQuery: 'SELECT COUNT(*) AS total FROM dogs;',
    validate: (rows, columns) => {
      const col = columns.map((c) => c.toLowerCase());
      if (
        (col.includes('total') || col.some((c) => c.includes('count'))) &&
        rows[0]?.[0] === '5' &&
        rows.length === 1
      ) {
        return { ok: true, message: 'Five good dogs — Annie and friends!' };
      }
      return { ok: false, message: 'Try: SELECT COUNT(*) AS total FROM dogs;' };
    },
  },
} satisfies Partial<Record<string, Lesson>>;
