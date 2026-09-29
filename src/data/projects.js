// Data-driven project list — the /projets/ index page renders this array,
// so adding a future project means adding one entry here (plus its own
// dedicated page under /projets/<slug>/), never rewriting the index page.

import { AMAZON_BOOK_URL } from '../config/site.js';

export const projects = [
  {
    slug: 'oser-la-demence-artistique',
    title: 'Oser la démence artistique',
    tome: 'Tome I — Le Manifeste',
    author: 'Cyril Mukendi',
    status: 'published', // 'published' | 'upcoming'
    summary:
      "Un manifeste incisif, drôle et pragmatique pour déconstruire la censure intérieure et créer sans demander la permission.",
    href: '/projets/oser-la-demence-artistique/',
    amazonUrl: AMAZON_BOOK_URL,
  },
];
