/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-service block variant.
 * Base: cards. Source: https://www.btwholesale.com/
 * Generated: 2026-03-13
 *
 * Source DOM: .component-v2-product-service-grid (each contains 1 card)
 *   - figure > img (card image)
 *   - figcaption > h2 (title)
 *   - .component-v2-product-service-grid__bodytext (description + product links)
 *   - footer.cta-container > a (CTA link)
 *
 * Collects all .component-v2-product-service-grid elements on the page into one block.
 *
 * Target: cards block (cards-service variant)
 *   Each row: [image cell | text content cell (title, description, links, CTA)]
 */
export default function parse(element, { document }) {
  // Skip if already removed from DOM by a previous sibling parse
  if (!element.parentElement) return;

  // Collect ALL product-service-grid cards on the page
  const allCards = Array.from(document.querySelectorAll('.component-v2-product-service-grid'));

  // Only process when called on the first card; skip subsequent calls
  if (allCards.length > 1 && allCards[0] !== element) {
    // Remove this element so it doesn't remain as leftover content
    element.remove();
    return;
  }

  const cells = [];

  for (const card of allCards) {
    // Image
    const img = card.querySelector('img');

    // Title heading
    const title = card.querySelector('figcaption h2, h2');

    // Body text with description and product links
    const bodyDiv = card.querySelector('.component-v2-product-service-grid__bodytext');

    // CTA link in footer
    const ctaLink = card.querySelector('footer.cta-container a, .cta-container a');

    // Build text content cell
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (bodyDiv) {
      const paras = bodyDiv.querySelectorAll('p');
      for (const p of paras) {
        const text = p.textContent.trim();
        // Skip empty paragraphs and nbsp-only paragraphs
        if (text && text !== '\u00a0') {
          textCell.appendChild(p);
        }
      }
    }
    if (ctaLink) {
      const p = document.createElement('p');
      p.appendChild(ctaLink);
      textCell.appendChild(p);
    }

    cells.push([img || '', textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);

  // Remove other card elements and their wrappers
  for (const card of allCards) {
    if (card !== element) {
      // Remove the wrapper parent if it exists
      const wrapper = card.closest('.product-service-grid');
      if (wrapper && wrapper.parentElement) {
        wrapper.remove();
      } else if (card.parentElement) {
        card.remove();
      }
    }
  }
}
