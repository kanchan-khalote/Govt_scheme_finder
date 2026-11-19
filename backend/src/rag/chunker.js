const MAX_CHARS = 800;
const OVERLAP = 100;

const splitLongText = (text) => {
  if (text.length <= MAX_CHARS) return [text];

  const pieces = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + MAX_CHARS, text.length);

    if (end < text.length) {
      const lastBreak = Math.max(
        text.lastIndexOf('\n', end),
        text.lastIndexOf('. ', end),
        text.lastIndexOf('। ', end)
      );
      if (lastBreak > start + MAX_CHARS / 2) end = lastBreak + 1;
    }

    pieces.push(text.slice(start, end).trim());
    if (end >= text.length) break;
    start = end - OVERLAP;
  }

  return pieces.filter(Boolean);
};

export const chunkScheme = (scheme) => {
  const chunks = [];

  for (const section of scheme.sections) {
    const parts = splitLongText(section.text);

    parts.forEach((part, i) => {
      chunks.push({
        schemeSlug: scheme.slug,
        schemeName: scheme.name,
        sectionTitle: section.title,
        chunkIndex: i,
        text: `${scheme.name} - ${section.title}: ${part}`,
        sourceUrl: scheme.sourceUrl,
        lastChecked: scheme.lastChecked,
      });
    });
  }

  return chunks;
};