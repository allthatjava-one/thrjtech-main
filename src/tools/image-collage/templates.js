export const TEMPLATES = [
  { id: 'single',       name: 'Single',       rows: 1, cols: 1 },
  { id: 'side-by-side', name: 'Side by Side', rows: 1, cols: 2 },
  { id: 'stacked',      name: 'Stacked',      rows: 2, cols: 1 },
  { id: 'grid-2x2',    name: '2×2 Grid',     rows: 2, cols: 2 },
  { id: 'strip-3',     name: 'Strip of 3',   rows: 1, cols: 3 },
  { id: 'grid-2x3',   name: '2×3 Grid',      rows: 2, cols: 3 },
];

export function getTemplateById(id) {
  return TEMPLATES.find(t => t.id === id) ?? TEMPLATES[0];
}
