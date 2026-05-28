import type { Lesson } from '../types';
import { hasColumns } from './validators';

export const aggregatesLessons = {
  'sum-avg': {
    id: 'sum-avg',
    moduleId: 'aggregates',
    emoji: '➕',
    title: 'SUM & AVG',
    subtitle: 'Adding up numbers',
    minutes: 12,
    story: [
      'How much did we spend on **all treats** combined? **SUM** adds numbers. **AVG** finds the average.',
    ],
    concepts: [
      { term: 'SUM(column)', plain: 'Adds up numeric values.' },
      { term: 'AVG(column)', plain: 'Average of numeric values.' },
    ],
    exampleQuery: 'SELECT SUM(price) AS total_spent FROM treats;',
    exampleCaption: 'Total price of every treat.',
    task: 'Find the **average** treat price. Name the result **avg_price**.',
    starterQuery: 'SELECT AVG(price) AS avg_price FROM ',
    hints: ['FROM treats', 'SELECT AVG(price) AS avg_price FROM treats;'],
    solutionQuery: 'SELECT AVG(price) AS avg_price FROM treats;',
    validate: (rows, columns) => {
      const col = columns.map((c) => c.toLowerCase());
      const val = parseFloat(rows[0]?.[0] ?? '0');
      if (col.some((c) => c.includes('avg')) && rows.length === 1 && val > 4 && val < 4.2) {
        return { ok: true, message: 'Average price calculated — about $4.18!' };
      }
      return { ok: false, message: 'Try: SELECT AVG(price) AS avg_price FROM treats;' };
    },
  },

  'group-by': {
    id: 'group-by',
    moduleId: 'aggregates',
    emoji: '📦',
    title: 'GROUP BY',
    subtitle: 'Totals per group',
    minutes: 15,
    story: [
      'How many times was each **treat** given out? The **dog_treats** table logs every hand-out.',
      '**GROUP BY** splits rows into groups, then you aggregate each group.',
    ],
    concepts: [
      { term: 'GROUP BY', plain: 'One result row per unique value.' },
      { term: 'COUNT with GROUP BY', plain: 'Count rows in each group.' },
    ],
    exampleQuery:
      'SELECT dog_id, COUNT(*) AS treat_count FROM dog_treats GROUP BY dog_id;',
    exampleCaption: 'How many treat records per dog.',
    task: 'For each **dog_id**, count how many treat records exist. Name the count **times**.',
    starterQuery: 'SELECT dog_id, COUNT(*) AS times FROM dog_treats GROUP BY ',
    hints: [
      'GROUP BY dog_id',
      'SELECT dog_id, COUNT(*) AS times FROM dog_treats GROUP BY dog_id;',
    ],
    solutionQuery:
      'SELECT dog_id, COUNT(*) AS times FROM dog_treats GROUP BY dog_id;',
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['dog_id']) || rows.length < 4) {
        return { ok: false, message: 'Group by dog_id — expect several rows.' };
      }
      const hasTimes = columns.map((c) => c.toLowerCase()).some((c) => c.includes('times') || c.includes('count'));
      if (hasTimes && rows.length === 5) {
        return { ok: true, message: 'Grouped by dog — you can see who gets the most entries!' };
      }
      return { ok: false, message: 'Use GROUP BY dog_id with COUNT(*) AS times.' };
    },
  },

  having: {
    id: 'having',
    moduleId: 'aggregates',
    emoji: '🎯',
    title: 'HAVING',
    subtitle: 'Filter groups',
    minutes: 15,
    story: [
      'Which dogs got treats **more than 10 times** total? **WHERE** filters rows; **HAVING** filters **groups** after GROUP BY.',
    ],
    concepts: [
      { term: 'HAVING', plain: 'Filter grouped results (used after GROUP BY).' },
      { term: 'SUM(...) > 10', plain: 'Only groups matching the rule.' },
    ],
    exampleQuery: `SELECT dog_id, SUM(times_given) AS total
FROM dog_treats
GROUP BY dog_id
HAVING SUM(times_given) > 10;`,
    exampleCaption: 'Dogs with more than 10 total treats given.',
    task: 'Show **dog_id** and total **times_given** (sum) per dog, but only groups where the sum is **greater than 10**. Name the sum **total**.',
    starterQuery: 'SELECT dog_id, SUM(times_given) AS total FROM dog_treats GROUP BY dog_id HAVING ',
    hints: [
      'HAVING SUM(times_given) > 10',
      `SELECT dog_id, SUM(times_given) AS total FROM dog_treats GROUP BY dog_id HAVING SUM(times_given) > 10;`,
    ],
    solutionQuery: `SELECT dog_id, SUM(times_given) AS total FROM dog_treats GROUP BY dog_id HAVING SUM(times_given) > 10;`,
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['dog_id']) || rows.length < 2) {
        return { ok: false, message: 'HAVING total > 10 should leave a few dogs.' };
      }
      const allOverTen = rows.every((r) => parseFloat(r[1] ?? '0') > 10);
      if (allOverTen) {
        return { ok: true, message: 'HAVING filtered the groups — only big treat totals!' };
      }
      return { ok: false, message: 'Use HAVING SUM(times_given) > 10 after GROUP BY.' };
    },
  },
} satisfies Record<string, Lesson>;
