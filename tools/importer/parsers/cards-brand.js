/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-brand variant.
 * Base: cards
 * Source: https://www.directlinegroup.co.uk/en/index.html
 * Selector: .carousels-par .pageteaser, .parsys_column.column_3_33-33-33 .pageteaser
 * Source structure: .pageteaser with .teaser-inner containing h2 > a (title), .image-wrapper > a > img, .link-wrapper > a (CTA)
 */
export default function parse(element, { document }) {
  // Each pageteaser is one card row in the cards block
  // Extract: image, title (linked), CTA link

  const inner = element.querySelector('.teaser-inner') || element;

  // Extract image
  const img = inner.querySelector('.image-wrapper img, .cq-dd-teaserimage, img');

  // Extract title heading (may be linked)
  const heading = inner.querySelector('h2');

  // Extract CTA link
  const ctaLink = inner.querySelector('.link-wrapper a, a.internal');

  // Build one row per card: [image, title + CTA]
  const imageCell = [];
  if (img) {
    imageCell.push(img);
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (ctaLink && ctaLink !== heading?.querySelector('a')) {
    contentCell.push(ctaLink);
  }

  const cells = [];
  if (imageCell.length > 0 || contentCell.length > 0) {
    cells.push([imageCell.length > 0 ? imageCell : '', contentCell.length > 0 ? contentCell : '']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-brand', cells });
  element.replaceWith(block);
}
