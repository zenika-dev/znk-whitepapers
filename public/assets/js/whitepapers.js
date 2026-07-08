// ── Whitepaper catalogue ───────────────────────────────────────────────────────
// Add one entry per whitepaper. Each locale needs title, topic, summary.
// Optional `detail` powers the on-site preview view (see main.js renderDetail).
const WHITEPAPERS = [
  {
    id: 'agentic-manifesto',
    locales: {
      en: {
        title:    'The Agentic Development Manifesto',
        topic:    'AI Engineering',
        summary:  'This whitepaper lays out a practical framework for engineering teams to adopt agentic AI methodically, stay vendor-independent, and turn individual gains into durable organisational performance.',
        detail: {
          published: 'Singapore edition · June 2026',
          lead: 'Generative AI is accelerating software development — but without an adapted methodology, it can create as many problems as it solves. This whitepaper contributes a framework for turning that acceleration into durable organisational performance.',
          ship: "It builds on Zenika's AI Multiplier framework — Shape (strategy, discovery, design), Ship (engineering and delivery), and Sync (architectures and platforms) — focusing on the Ship discipline and its intersections with the other two.",
          takeaways: [
            { icon: '📐', title: 'Methodology beats raw speed', text: 'AI without methodology accelerates technical debt. Specification Driven Development turns individual productivity into durable organisational performance.' },
            { icon: '🔌', title: 'Depend on no one', text: 'A pluggable AI platform — gateway, registry, context factory — guarantees the freedom to switch model, provider, or cloud at any time.' },
            { icon: '❤️', title: 'Craftsmanship + AI', text: 'Curated shared instructions scale quality beyond individual discipline.' },
            { icon: '⚖️', title: 'Measure value, not volume', text: 'AI should be measured by the systemic friction it eliminates, not by the code it generates.' },
          ],
          quote: 'The question is no longer whether your organisation will adopt AI in its development cycle, but how it will do so — opportunistically and dependently, or methodically and independently.',
          stats: [
            { value: '72%', label: 'of developers use AI daily', source: 'Sonar 2026' },
            { value: '96%', label: "don't fully trust AI's accuracy", source: 'Sonar 2026' },
            { value: '21%', label: 'more tasks completed per developer', source: 'DORA 2025' },
          ],
        },
      },
      fr: {
        title:    'Le Manifeste du Développement Agentique',
        topic:    'Ingénierie IA',
        summary:  "Ce livre blanc présente un cadre pratique permettant aux équipes d'ingénierie d'adopter l'IA agentique de manière méthodique, de rester indépendantes des fournisseurs et de transformer les gains individuels en performance organisationnelle durable.",
        detail: {
          published: 'Édition Singapour · Juin 2026',
          lead: "L'IA générative accélère le développement logiciel — mais sans méthodologie adaptée, elle peut créer autant de problèmes qu'en résoudre. Ce livre blanc propose un cadre pour transformer cette accélération en performance organisationnelle durable.",
          ship: "Il s'inscrit dans le framework AI Multiplier de Zenika — Shape (stratégie, discovery, design), Ship (ingénierie et delivery) et Sync (architectures et plateformes) — avec un focus sur la discipline Ship et ses intersections avec les deux autres.",
          takeaways: [
            { icon: '📐', title: 'La méthode prime sur la vitesse', text: "L'IA sans méthodologie accélère la dette technique. Le Specification Driven Development transforme la productivité individuelle en performance organisationnelle durable." },
            { icon: '🔌', title: 'Ne dépendez de personne', text: 'Une plateforme AI débrayable — gateway, registry, context factory — garantit la liberté de basculer de modèle, fournisseur ou cloud à tout moment.' },
            { icon: '❤️', title: 'Craftsmanship + IA', text: 'Les instructions de développement partagées scalent la qualité au-delà de la discipline individuelle.' },
            { icon: '⚖️', title: 'Mesurez la valeur, pas le volume', text: "L'IA se mesure aux frictions systémiques qu'elle élimine, pas au code qu'elle génère." },
          ],
          quote: "La question n'est plus de savoir si votre organisation adoptera l'IA dans son cycle de développement, mais comment elle le fera — de manière opportuniste et dépendante, ou de manière méthodique et souveraine.",
          stats: [
            { value: '72%', label: "des développeurs utilisent l'IA quotidiennement", source: 'Sonar 2026' },
            { value: '96%', label: "ne font pas totalement confiance à la justesse de l'IA", source: 'Sonar 2026' },
            { value: '21%', label: 'de tâches supplémentaires par développeur', source: 'DORA 2025' },
          ],
        },
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
