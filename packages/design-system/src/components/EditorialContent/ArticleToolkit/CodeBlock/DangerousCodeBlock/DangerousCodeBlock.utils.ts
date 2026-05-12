export const cleanMarkup = (html: string | undefined | null, cleanQuotes: boolean): string => {
  if (!html || !cleanQuotes) return html ?? '';

  let cleaned = html.replace(/[’‘]/g, "'");
  cleaned = cleaned.replace(/[“”″]/g, '"');

  return cleaned;
};
