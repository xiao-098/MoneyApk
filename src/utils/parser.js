import categories from '../data/categories.json';
import keywords from '../data/keywords.json';

export function parseInput(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  // Extract amount: match numbers (including decimals)
  const amountMatch = trimmed.match(/(\d+\.?\d*)/);
  if (!amountMatch) return null;

  const amount = parseFloat(amountMatch[1]);
  if (amount <= 0) return null;

  // Extract note: everything except the amount
  const note = trimmed.replace(amountMatch[0], '').trim();

  // Try to match category from keywords
  const category = matchCategory(note || trimmed);

  return { amount, note: note || null, category };
}

function matchCategory(text) {
  if (!text) return null;

  const lower = text.toLowerCase();

  for (const [categoryId, keywordList] of Object.entries(keywords)) {
    if (categoryId === 'other') continue;
    for (const keyword of keywordList) {
      if (lower.includes(keyword.toLowerCase())) {
        return categories.find(c => c.id === categoryId) || null;
      }
    }
  }

  return null;
}

export function getCategoryById(id) {
  return categories.find(c => c.id === id) || null;
}

export function getAllCategories() {
  return categories;
}
