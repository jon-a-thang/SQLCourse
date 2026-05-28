import type { Lesson } from '../types';
import { hasColumns, rowsKey } from './validators';

export const capstoneLessons = {
  'midterm-challenge': {
    id: 'midterm-challenge',
    moduleId: 'capstone',
    emoji: '🎓',
    title: 'Midterm Challenge',
    subtitle: 'Filters + sort',
    minutes: 15,
    story: [
      'Checkpoint! Annie wants **beef treats**, cheapest first — using skills from Part 1–2.',
    ],
    concepts: [{ term: 'Combine', plain: 'SELECT, WHERE, ORDER BY together.' }],
    task: 'Show **name** and **price** for **beef** treats, sorted by price low to high.',
    starterQuery: 'SELECT name, price FROM treats WHERE ',
    hints: [
      "flavor = 'beef'",
      "SELECT name, price FROM treats WHERE flavor = 'beef' ORDER BY price ASC;",
    ],
    solutionQuery:
      "SELECT name, price FROM treats WHERE flavor = 'beef' ORDER BY price ASC;",
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name', 'price']) || rows.length !== 2) {
        return { ok: false, message: "Two beef treats — use WHERE flavor = 'beef'." };
      }
      const expectedKey = rowsKey(
        ['name', 'price'],
        [
          ['Beef Minis', '2.99'],
          ['Beef Jerky Chews', '5.25'],
        ]
      );
      const actualKey = rowsKey(columns, rows);
      const prices = rows.map((r) => parseFloat(r[1] ?? '0'));
      if (actualKey === expectedKey && prices[0] <= prices[1]) {
        return { ok: true, message: 'Midterm passed — Annie is impressed!' };
      }
      return { ok: false, message: "Beef treats, sorted: WHERE flavor = 'beef' ORDER BY price ASC." };
    },
  },

  'final-challenge': {
    id: 'final-challenge',
    moduleId: 'capstone',
    emoji: '🏆',
    title: 'Final Challenge',
    subtitle: 'Everything together',
    minutes: 20,
    story: [
      'Ultimate task: For each **dog**, show how many **different treats** they received, but only dogs with **more than one** treat type.',
      'You will need **JOIN**, **GROUP BY**, and **HAVING**.',
    ],
    concepts: [
      { term: 'COUNT(DISTINCT ...)', plain: 'Count unique values in a group.' },
      { term: 'Full stack', plain: 'Join → group → filter groups.' },
    ],
    exampleQuery: `SELECT dogs.name, COUNT(DISTINCT dog_treats.treat_id) AS treat_types
FROM dogs
INNER JOIN dog_treats ON dogs.id = dog_treats.dog_id
GROUP BY dogs.name
HAVING COUNT(DISTINCT dog_treats.treat_id) > 1;`,
    exampleCaption: 'Dogs with more than one kind of treat.',
    task: 'Show **dog name** and count of **distinct treat_id** per dog (name it **treat_types**). Only dogs with **more than 1** distinct treat. Join dogs and dog_treats.',
    starterQuery: `SELECT dogs.name, COUNT(DISTINCT dog_treats.treat_id) AS treat_types
FROM dogs
INNER JOIN dog_treats ON dogs.id = dog_treats.dog_id
GROUP BY dogs.name
HAVING `,
    hints: [
      'HAVING COUNT(DISTINCT dog_treats.treat_id) > 1',
      'COUNT(DISTINCT dog_treats.treat_id) in SELECT',
    ],
    solutionQuery: `SELECT dogs.name, COUNT(DISTINCT dog_treats.treat_id) AS treat_types
FROM dogs
INNER JOIN dog_treats ON dogs.id = dog_treats.dog_id
GROUP BY dogs.name
HAVING COUNT(DISTINCT dog_treats.treat_id) > 1;`,
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name']) || rows.length < 2) {
        return { ok: false, message: 'JOIN, GROUP BY name, HAVING treat_types > 1.' };
      }
      const annie = rows.find((r) => r[0]?.toLowerCase() === 'annie');
      if (annie && parseInt(annie[1] ?? '0', 10) >= 2) {
        return {
          ok: true,
          message: "Course complete! You're ready for real SQL. Annie says woof! 🐕",
        };
      }
      return { ok: false, message: 'Use COUNT(DISTINCT treat_id) ... HAVING COUNT(...) > 1.' };
    },
  },
} satisfies Record<string, Lesson>;
