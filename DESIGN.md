# Design notes

Mood: a coastal ledger. Calm, exact, readable on a phone in the sun. Trust comes from the numbers being visible, not from photography.

Palette (tokens in `src/styles/global.css`): paper `#f7f8f6`, ink `#172026`, muted `#5c6b6f`, rule `#d8dedb`, accent lagoon `#0b7a75`. Dark theme swaps paper and ink and lifts the accent to `#5fc4bd`. One accent, used for links, the primary button and the answer block's rule; never on headings.

Typography: Fraunces (variable, optical size) for headings, Public Sans (variable) for body, the system monospace for code. Body 17 px, line length under 70 characters, tabular figures in tables.

Spacing base: 4 px. Radius: 6 px on buttons and cards, none on tables. Depth: hairline borders, no shadows.

Motion: none beyond the browser's own. The menu and the FAQ open instantly. `prefers-reduced-motion` disables the smooth scroll.

Assets: one hero per page at most, from the site's own CDN, with width and height. No stock photography, no decorative illustration.

Do: lead with the number, put the source in the same paragraph, keep the table narrower than the text, let the district name carry the page. Don't: gradients, cards with shadows on every block, emoji as icons, a second accent, animation on scroll.
