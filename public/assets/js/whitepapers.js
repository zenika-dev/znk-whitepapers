// ── Whitepaper catalogue ───────────────────────────────────────────────────────
// Add one entry per whitepaper. Each locale needs title, topic, summary, filePath.
const WHITEPAPERS = [
  {
    id: 'agentic-manifesto',
    locales: {
      en: {
        title:    'The Agentic Development Manifesto',
        topic:    'AI Engineering',
        summary:  'This whitepaper lays out a practical framework for engineering teams to adopt agentic AI methodically, stay vendor-independent, and turn individual gains into durable organisational performance.',
        filePath: 'assets/resources/The-Agentic-Development-Manifesto.pdf',
      },
      fr: {
        title:    'Le Manifeste du Développement Agentique',
        topic:    'Ingénierie IA',
        summary:  "Ce livre blanc présente un cadre pratique permettant aux équipes d'ingénierie d'adopter l'IA agentique de manière méthodique, de rester indépendantes des fournisseurs et de transformer les gains individuels en performance organisationnelle durable.",
        filePath: 'assets/resources/Le-Manifeste-du-Développement-Agentique.pdf',
      },
    },
  },
];

// Inject whitepaper copy into TRANSLATIONS so t() and data-i18n work unchanged.
WHITEPAPERS.forEach(wp =>
  Object.entries(wp.locales).forEach(([lang, data]) => {
    TRANSLATIONS[lang] ??= {};
    TRANSLATIONS[lang][`whitepapers.${wp.id}.title`]   = data.title;
    TRANSLATIONS[lang][`whitepapers.${wp.id}.topic`]   = data.topic;
    TRANSLATIONS[lang][`whitepapers.${wp.id}.summary`] = data.summary;
  })
);
// ─────────────────────────────────────────────────────────────────────────────
