import type { Lesson } from '../types';
import { hasColumns } from './validators';

export const advancedLessons = {
  aliases: {
    id: 'aliases',
    moduleId: 'advanced',
    emoji: '🏷️',
    title: 'Nicknames for Tables',
    subtitle: 'Aliases',
    minutes: 10,
    story: [
      'Long table names get tiring. Give tables short **aliases** with AS (or a space).',
    ],
    concepts: [
      { term: 'Alias', plain: 'Short name like d for dogs.' },
      { term: 'd.name', plain: 'Column from aliased table.' },
    ],
    exampleQuery: 'SELECT d.name, d.age FROM dogs AS d WHERE d.age > 4;',
    exampleCaption: 'dogs aliased as d.',
    task: 'Use alias **t** for treats. Show **t.name** and **t.price** for treats with price **under 4**.',
    starterQuery: 'SELECT t.name, t.price FROM treats AS t WHERE ',
    hints: ['t.price < 4', 'SELECT t.name, t.price FROM treats AS t WHERE t.price < 4;'],
    solutionQuery: 'SELECT t.name, t.price FROM treats AS t WHERE t.price < 4;',
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name', 'price']) || rows.length !== 2) {
        return { ok: false, message: 'Two treats cost under $4.' };
      }
      const prices = rows.map((r) => parseFloat(r[1] ?? '99'));
      if (prices.every((p) => p < 4)) {
        return { ok: true, message: 'Aliases keep queries readable!' };
      }
      return { ok: false, message: 'Use treats AS t and t.price < 4.' };
    },
  },

  limit: {
    id: 'limit',
    moduleId: 'advanced',
    emoji: '🔝',
    title: 'Just the Top Few',
    subtitle: 'LIMIT',
    minutes: 10,
    story: [
      'Show only the **3 oldest dogs**. **LIMIT** caps how many rows come back.',
      'Often paired with ORDER BY.',
    ],
    concepts: [
      { term: 'LIMIT n', plain: 'Return at most n rows.' },
      { term: 'ORDER BY ... DESC', plain: 'DESC = descending (biggest first).' },
    ],
    exampleQuery: 'SELECT name, age FROM dogs ORDER BY age DESC LIMIT 3;',
    exampleCaption: 'Three oldest dogs.',
    task: 'Show the **2 cheapest treats** (name and price). Sort by price ascending, then **LIMIT 2**.',
    starterQuery: 'SELECT name, price FROM treats ORDER BY price ASC LIMIT ',
    hints: ['LIMIT 2 at the end'],
    solutionQuery: 'SELECT name, price FROM treats ORDER BY price ASC LIMIT 2;',
    validate: (rows) => {
      if (rows.length !== 2) {
        return { ok: false, message: 'LIMIT 2 returns exactly two rows.' };
      }
      const names = rows.map((r) => r[0]).sort().join(',');
      if (names.includes('Beef Minis') && names.includes('Peanut')) {
        return { ok: true, message: 'Top 2 cheapest treats — LIMIT works!' };
      }
      return { ok: false, message: 'ORDER BY price ASC LIMIT 2.' };
    },
  },

  'case-when': {
    id: 'case-when',
    moduleId: 'advanced',
    emoji: '🔀',
    title: 'Labels with CASE',
    subtitle: 'CASE WHEN',
    minutes: 12,
    story: [
      'Group dogs into **puppy** vs **adult** without a new table. **CASE** creates conditional labels.',
    ],
    concepts: [
      { term: 'CASE WHEN', plain: 'If-then rules inside a query.' },
      { term: 'ELSE', plain: 'What to show otherwise.' },
    ],
    exampleQuery: `SELECT name, age,
  CASE WHEN age < 2 THEN 'puppy' ELSE 'adult' END AS size
FROM dogs;`,
    exampleCaption: 'Custom size column.',
    task: 'Show **name** and a column **size** where age **under 3** is **young**, else **grown**.',
    starterQuery: `SELECT name,
  CASE WHEN age < 3 THEN 'young' ELSE 'grown' END AS size
FROM dogs;`,
    hints: ['Change the CASE in the starter query if needed', 'END AS size names the column'],
    solutionQuery: `SELECT name,
  CASE WHEN age < 3 THEN 'young' ELSE 'grown' END AS size
FROM dogs;`,
    validate: (rows, cols) => {
      const lower = cols.map((c) => c.toLowerCase());
      if (!lower.includes('name') || !lower.some((c) => c.includes('size'))) {
        return { ok: false, message: 'Need name and a size column from CASE.' };
      }
      const rocky = rows.find((r) => r[0]?.toLowerCase() === 'rocky');
      if (rocky && rocky[1]?.toLowerCase() === 'young') {
        return { ok: true, message: 'CASE labels worked — Rocky is young!' };
      }
      return { ok: false, message: 'CASE WHEN age < 3 THEN young ELSE grown.' };
    },
  },

  subquery: {
    id: 'subquery',
    moduleId: 'advanced',
    emoji: '📦',
    title: 'Query Inside a Query',
    subtitle: 'Subqueries',
    minutes: 15,
    story: [
      'Find dogs who got a treat **more expensive than $4**.',
      'First find pricey treat IDs in a **subquery**, then filter **dog_treats**.',
    ],
    concepts: [
      { term: 'Subquery', plain: 'A SELECT inside another SELECT.' },
      { term: 'IN (subquery)', plain: 'Match values from the inner query.' },
    ],
    exampleQuery: `SELECT name FROM dogs
WHERE id IN (
  SELECT dog_id FROM dog_treats
  WHERE treat_id IN (SELECT id FROM treats WHERE price > 4)
);`,
    exampleCaption: 'Dogs linked to expensive treats.',
    task: 'List **dog names** who appear in **dog_treats** for treat id **1** (Bacon Strips). Use `WHERE id IN (SELECT dog_id FROM dog_treats WHERE treat_id = 1)`.',
    starterQuery: `SELECT name FROM dogs
WHERE id IN (
  SELECT dog_id FROM dog_treats WHERE treat_id = 1
);`,
    hints: ['The starter query is complete — run it!', 'You can also write it from scratch.'],
    solutionQuery: `SELECT name FROM dogs
WHERE id IN (
  SELECT dog_id FROM dog_treats WHERE treat_id = 1
);`,
    validate: (rows, columns) => {
      if (columns.length === 1 && rows.length === 2) {
        const names = rows.map((r) => r[0]?.toLowerCase()).sort().join(',');
        if (names === 'annie,biscuit') {
          return { ok: true, message: 'Subquery found Annie and Biscuit — bacon fans!' };
        }
      }
      return { ok: false, message: 'Use IN (SELECT dog_id FROM dog_treats WHERE treat_id = 1).' };
    },
  },
} satisfies Record<string, Lesson>;
