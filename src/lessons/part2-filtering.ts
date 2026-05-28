import type { Lesson } from '../types';
import { hasColumns } from './validators';

export const filteringLessons = {
  'and-or': {
    id: 'and-or',
    moduleId: 'filtering',
    emoji: '🧩',
    title: 'AND & OR',
    subtitle: 'Combine conditions',
    minutes: 12,
    story: [
      'You want dogs who are **young** AND love a **rope toy**.',
      '**AND** means both must be true. **OR** means at least one.',
    ],
    concepts: [
      { term: 'AND', plain: 'Both conditions must match.' },
      { term: 'OR', plain: 'Either condition can match.' },
    ],
    exampleQuery:
      "SELECT name, age FROM dogs WHERE age < 3 OR favorite_toy = 'frisbee';",
    exampleCaption: 'Young dogs or frisbee fans.',
    task: 'Show **name** and **breed** for dogs who are a **beagle** AND **younger than 4**.',
    starterQuery: 'SELECT name, breed FROM dogs WHERE ',
    hints: [
      "breed = 'beagle' AND age < 4",
      "SELECT name, breed FROM dogs WHERE breed = 'beagle' AND age < 4;",
    ],
    solutionQuery: "SELECT name, breed FROM dogs WHERE breed = 'beagle' AND age < 4;",
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name', 'breed']) || rows.length !== 1) {
        return { ok: false, message: "You should get one row — Daisy the beagle." };
      }
      if (rows[0]?.[0]?.toLowerCase() === 'daisy') {
        return { ok: true, message: 'Perfect AND logic — only Daisy fits both rules!' };
      }
      return { ok: false, message: "Use AND with breed = 'beagle' and age < 4." };
    },
  },

  like: {
    id: 'like',
    moduleId: 'filtering',
    emoji: '🔤',
    title: 'Fuzzy Search',
    subtitle: 'LIKE patterns',
    minutes: 12,
    story: [
      'You remember a treat has **“Butter”** in the name but not the full name.',
      '**LIKE** matches patterns. **%** means “anything.”',
    ],
    concepts: [
      { term: 'LIKE', plain: 'Match text patterns.' },
      { term: '%', plain: 'Wildcard — any characters.' },
    ],
    exampleQuery: "SELECT name FROM treats WHERE name LIKE '%Beef%';",
    exampleCaption: 'Any treat with “Beef” in the name.',
    task: 'Find treat **names** where the name contains **“Bacon”**.',
    starterQuery: "SELECT name FROM treats WHERE name LIKE '",
    hints: ["'%Bacon%'", "SELECT name FROM treats WHERE name LIKE '%Bacon%';"],
    solutionQuery: "SELECT name FROM treats WHERE name LIKE '%Bacon%';",
    validate: (rows, columns) => {
      if (columns.length === 1 && rows.length === 1 && rows[0]?.[0] === 'Bacon Strips') {
        return { ok: true, message: 'Found Bacon Strips with LIKE!' };
      }
      return { ok: false, message: "Use LIKE '%Bacon%' around the word Bacon." };
    },
  },

  'in-not-in': {
    id: 'in-not-in',
    moduleId: 'filtering',
    emoji: '📋',
    title: 'IN a List',
    subtitle: 'Match several values',
    minutes: 10,
    story: [
      'Annie is picking treats for picky eaters: **meat** or **peanut** flavor only.',
      '**IN (...)** checks if a value is in a list.',
    ],
    concepts: [
      { term: 'IN', plain: 'Value matches one of several options.' },
      { term: 'NOT IN', plain: 'Value is not in the list.' },
    ],
    exampleQuery: "SELECT name, flavor FROM treats WHERE flavor IN ('beef', 'meat');",
    exampleCaption: 'Beef or meat flavors.',
    task: 'Show **name** and **flavor** for treats where flavor is **meat** or **peanut**.',
    starterQuery: 'SELECT name, flavor FROM treats WHERE flavor IN (',
    hints: [
      "('meat', 'peanut')",
      "SELECT name, flavor FROM treats WHERE flavor IN ('meat', 'peanut');",
    ],
    solutionQuery: "SELECT name, flavor FROM treats WHERE flavor IN ('meat', 'peanut');",
    validate: (rows, columns) => {
      if (!hasColumns(columns, ['name', 'flavor']) || rows.length !== 2) {
        return { ok: false, message: 'You should get two treats.' };
      }
      const names = rows.map((r) => r[0]).sort().join(',');
      if (names === 'Bacon Strips,Peanut Butter Bites') {
        return { ok: true, message: 'IN list worked — two flavors found!' };
      }
      return { ok: false, message: "Use IN ('meat', 'peanut')." };
    },
  },

  distinct: {
    id: 'distinct',
    moduleId: 'filtering',
    emoji: '✨',
    title: 'Unique Values',
    subtitle: 'DISTINCT',
    minutes: 10,
    story: [
      'What **flavors** do we carry? Some treats share a flavor — you only want each flavor once.',
      '**DISTINCT** removes duplicates.',
    ],
    concepts: [{ term: 'DISTINCT', plain: 'Show each value only once.' }],
    exampleQuery: 'SELECT DISTINCT breed FROM dogs;',
    exampleCaption: 'Each breed listed once.',
    task: 'List each **flavor** only once from the treats table.',
    starterQuery: 'SELECT DISTINCT ',
    hints: ['DISTINCT flavor FROM treats', 'SELECT DISTINCT flavor FROM treats;'],
    solutionQuery: 'SELECT DISTINCT flavor FROM treats;',
    validate: (rows, columns) => {
      const col = columns.map((c) => c.toLowerCase());
      if (col.includes('flavor') && rows.length === 4) {
        return { ok: true, message: 'Four unique flavors — no duplicates!' };
      }
      return { ok: false, message: 'Try: SELECT DISTINCT flavor FROM treats;' };
    },
  },
} satisfies Record<string, Lesson>;
