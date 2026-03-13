/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero block.
 * Base: hero. Source: https://www.btwholesale.com/
 * Generated: 2026-03-13
 *
 * Source DOM: section.component-v2-hero-block-inset-text.full-width-breakout
 *   - img (background image — may be direct child or lazy-loaded)
 *   - .component-v2-hero-block-inset-text__bodytext > h1/h2 heading + p description
 *   - .cta-container a (CTA link)
 *
 * Target: hero block
 *   Row 1 (optional): background image (single cell)
 *   Row 2: heading + description + CTA (single cell with all content)
 */
export default function parse(element, { document }) {
  // Background image — try direct child first, then any img outside bodytext/cta
  let bgImage = element.querySelector(':scope > img');
  if (!bgImage) {
    // Fallback: find first img that is NOT inside bodytext or cta-container
    const allImages = element.querySelectorAll('img');
    for (const img of allImages) {
      if (!img.closest('.component-v2-hero-block-inset-text__bodytext') && !img.closest('.cta-container')) {
        bgImage = img;
        break;
      }
    }
  }

  // Heading — h1 or h2 inside bodytext
  const heading = element.querySelector('.component-v2-hero-block-inset-text__bodytext h1, .component-v2-hero-block-inset-text__bodytext h2');

  // Description paragraph — non-empty p inside bodytext (skip empty paragraphs)
  const bodytext = element.querySelector('.component-v2-hero-block-inset-text__bodytext');
  let description = null;
  if (bodytext) {
    const paragraphs = bodytext.querySelectorAll('p');
    for (const p of paragraphs) {
      const text = p.textContent.trim();
      if (text && text.length > 1) {
        description = p;
        break;
      }
    }
  }

  // CTA link
  const cta = element.querySelector('.cta-container a');

  // Build cells matching hero block library structure
  const cells = [];

  // Row 1 (optional): background image as single cell
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: all content in a SINGLE cell (heading + description + CTA wrapped in a div)
  const contentContainer = document.createElement('div');
  if (heading) contentContainer.appendChild(heading);
  if (description) contentContainer.appendChild(description);
  if (cta) {
    const p = document.createElement('p');
    p.appendChild(cta);
    contentContainer.appendChild(p);
  }
  cells.push([contentContainer]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
