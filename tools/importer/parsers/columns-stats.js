/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-stats variant.
 * Base: columns
 * Source: https://www.directlinegroup.co.uk/en/index.html
 * Selector: .teaser-inner.plain-background
 * Source structure: .teaser-inner with h2, .parsys_column with 3 stat columns,
 *   each containing .text p (label), .statistic-title h3 (value), .statistic-text1 (description)
 */
export default function parse(element, { document }) {
  // Extract section heading
  const heading = element.querySelector('h2');

  // Extract statistic columns
  const columns = element.querySelectorAll(
    '.parsys_column[class*="33-33-33-c0"], .parsys_column[class*="33-33-33-c1"], .parsys_column[class*="33-33-33-c2"]'
  );

  // Extract View More link
  const viewMoreLink = element.querySelector('a[href*="group-profile"]');

  // Extract footnotes
  const footnotes = element.querySelector('.text.parbase sup');

  // Build cells: one row per stat column
  // Row format: [label | value | description]
  const cells = [];

  columns.forEach((col) => {
    const label = col.querySelector('.text.parbase p, .default p');
    const value = col.querySelector('.statistic-title h3, .statistic-title span');
    const description = col.querySelector('.statistic-text1');

    const row = [];
    if (label) row.push(label);
    if (value) row.push(value);
    if (description) row.push(description);

    if (row.length > 0) {
      cells.push(row);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stats', cells });
  element.replaceWith(block);
}
