export default function slugify(text) {
  // Remove diacritics (accents) from the text
  text = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

  // Convert the text to lowercase
  text = text.toLowerCase();

  // Replace spaces with hyphens
  text = text.replace(/ /g, '-');

  // Remove all non-word characters (except hyphens)
  text = text.replace(/[^a-z0-9-]/g, '');

  // Replace multiple consecutive hyphens with a single hyphen
  text = text.replace(/-+/g, '-');

  // Trim leading and trailing hyphens
  text = text.replace(/^-|-$/g, '');

  return text;
}
