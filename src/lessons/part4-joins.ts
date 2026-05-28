import type { Lesson } from '../types';
import { hasColumns } from './validators';

export const joinsLessons = {
  'inner-join': {
    id: 'inner-join',
    moduleId: 'joins',
    emoji: '🔗',
    title: 'INNER JOIN',
    subtitle: 'Match rows from two tables',
    minutes: 15,
    story: [
      'Dogs and treats are in separate tables. **INNER JOIN** connects them where IDs match.',
      'Only rows that match on **both sides** appear.',
    ],
    concepts: [
      { term: 'JOIN', plain: 'Combine columns from two tables.' },
      { term: 'ON', plain: 'How the tables link (usually id = foreign_id).' },
    ],
    exampleQuery: `SELECT dogs.name, dog_treats.times_given
FROM dogs
INNER JOIN dog_treats ON dogs.id = dog_treats.dog_id;`,
    exampleCaption: 'Each dog with how many times treats were logged.',
    task: 'Show each **dog name** and **times_given** by joining **dogs** and **dog_treats** (match dogs.id = dog_treats.dog_id).',
    starterQuery: 'SELECT dogs.name, dog_treats.times_given\nFROM dogs\nINNER JOIN dog_treats ON ',
    hints: [
      'dogs.id = dog_treats.dog_id',
      'Use INNER JOIN ... ON dogs.id = dog_treats.dog_id',
    ],
    solutionQuery: `SELECT dogs.name, dog_treats.times_given
FROM dogs
INNER JOIN dog_treats ON dogs.id = dog_treats.dog_id;`,
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name']) || rows.length < 7) {
        return { ok: false, message: 'Join dogs to dog_treats — expect many rows.' };
      }
      if (rows.some((r) => r[0]?.toLowerCase() === 'annie')) {
        return { ok: true, message: 'Joined! Annie appears with her treat records.' };
      }
      return { ok: false, message: 'INNER JOIN dogs and dog_treats on id.' };
    },
  },

  'left-join': {
    id: 'left-join',
    moduleId: 'joins',
    emoji: '👈',
    title: 'LEFT JOIN',
    subtitle: 'Keep everyone on the left',
    minutes: 15,
    story: [
      'You want **every dog**, even if they have zero treat records.',
      '**LEFT JOIN** keeps all rows from the left table (dogs) and fills NULL when there is no match.',
    ],
    concepts: [
      { term: 'LEFT JOIN', plain: 'All rows from the first table, plus matches.' },
      { term: 'NULL', plain: 'Empty — no matching row on the other side.' },
    ],
    exampleQuery: `SELECT dogs.name, dog_treats.times_given
FROM dogs
LEFT JOIN dog_treats ON dogs.id = dog_treats.dog_id;`,
    exampleCaption: 'Every dog; NULL if no treat row.',
    task: 'List **every dog name** and **times_given** using a **LEFT JOIN** from dogs to dog_treats.',
    starterQuery: 'SELECT dogs.name, dog_treats.times_given\nFROM dogs\nLEFT JOIN dog_treats ON ',
    hints: ['Same ON clause as INNER JOIN', 'Use LEFT JOIN instead of INNER JOIN'],
    solutionQuery: `SELECT dogs.name, dog_treats.times_given
FROM dogs
LEFT JOIN dog_treats ON dogs.id = dog_treats.dog_id;`,
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name']) || rows.length < 8) {
        return { ok: false, message: 'LEFT JOIN should show at least 8 rows (some dogs repeat).' };
      }
      const names = new Set(rows.map((r) => r[0]?.toLowerCase()));
      if (names.has('annie') && names.has('cooper') && names.size === 5) {
        return { ok: true, message: 'All five dogs appear — LEFT JOIN keeps everyone!' };
      }
      return { ok: false, message: 'LEFT JOIN dogs with dog_treats.' };
    },
  },

  'join-three-tables': {
    id: 'join-three-tables',
    moduleId: 'joins',
    emoji: '🌭',
    title: 'Treat Names for Dogs',
    subtitle: 'Join three tables',
    minutes: 18,
    story: [
      'Now you want **dog name**, **treat name**, and **times given**.',
      'Chain joins: dogs → dog_treats → treats.',
    ],
    concepts: [
      { term: 'Multiple JOINs', plain: 'Link table A → B → C in one query.' },
    ],
    exampleQuery: `SELECT dogs.name, treats.name, dog_treats.times_given
FROM dogs
INNER JOIN dog_treats ON dogs.id = dog_treats.dog_id
INNER JOIN treats ON treats.id = dog_treats.treat_id;`,
    exampleCaption: 'Full treat history with names.',
    task: 'Show **dog name**, **treat name**, and **times_given** by joining all three tables.',
    starterQuery: `SELECT dogs.name, treats.name, dog_treats.times_given
FROM dogs
INNER JOIN dog_treats ON dogs.id = dog_treats.dog_id
INNER JOIN treats ON `,
    hints: [
      'treats.id = dog_treats.treat_id',
      'Join treats on treat id',
    ],
    solutionQuery: `SELECT dogs.name, treats.name, dog_treats.times_given
FROM dogs
INNER JOIN dog_treats ON dogs.id = dog_treats.dog_id
INNER JOIN treats ON treats.id = dog_treats.treat_id;`,
    validate: (rows, columns) => {
      const lower = columns.map((c) => c.toLowerCase());
      if (rows.length < 7 || !lower.some((c) => c.includes('name'))) {
        return { ok: false, message: 'Join dogs, dog_treats, and treats.' };
      }
      const hasAnnieBacon = rows.some(
        (r) => r[0]?.toLowerCase() === 'annie' && r[1]?.includes('Bacon')
      );
      if (hasAnnieBacon) {
        return { ok: true, message: 'Three-table join — Annie loves Bacon Strips!' };
      }
      return { ok: false, message: 'Chain INNER JOIN through dog_treats to treats.' };
    },
  },
} satisfies Record<string, Lesson>;
