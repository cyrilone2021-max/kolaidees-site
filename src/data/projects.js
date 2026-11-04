// Data-driven project list — the /projets/ index page renders this array,
// so adding a future project means adding one entry here (plus its own
// dedicated page under /projets/<slug>/), never rewriting the index page.

import { AMAZON_BOOK_URL, AMAZON_GUIDE_URL } from '../config/site.js';

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
  {
    slug: 'visibilite-et-monetisation-reseaux-sociaux',
    title: 'Visibilité & monétisation sur les réseaux sociaux',
    tome: 'Guide pratique — Europe & Afrique francophone',
    author: 'Cyril Mukendi',
    status: 'published',
    summary:
      "De 0 à 10 000 abonnés : une méthode claire, palier par palier, pour devenir visible et commencer à gagner de l'argent sur TikTok, Instagram, Facebook et YouTube Shorts.",
    href: '/projets/visibilite-et-monetisation-reseaux-sociaux/',
    amazonUrl: AMAZON_GUIDE_URL,
  },
];
