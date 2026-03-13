/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns block.
 * Base: columns. Source: https://www.btwholesale.com/
 * Generated: 2026-03-13
 *
 * Handles 3 column layout types on the BT Wholesale homepage:
 *
 * 1. Section 5 "After Something Else" — 3 icon+CTA columns
 *    Selector: .layout-container.aem-GridColumn--tablet-wide--4
 *    Each column: icon image + CTA button
 *
 * 2. Section 6 "Testimonials" — 2-column testimonial layout
 *    Selector: .component-layout-container__indigo-gradient .hero-block-inset-text
 *    Left: testimonial text + CTA, Right: image
 *
 * 3. Section 7 "Why BT Wholesale" — 3 value-prop columns
 *    Selector: .layout-container.aem-GridColumn--tablet-wide--4
 *    Each column: icon image + h3 title + description
 *
 * Parser collects all sibling column elements into one columns block.
 *
 * Target: columns block
 *   Single row with N cells (one per column)
 */
export default function parse(element, { document }) {
  // Skip if already removed from DOM by a previous sibling parse
  if (!element.parentElement) return;

  // Determine column type: testimonial (hero-block-inset-text) vs standard (layout-container)
  const isTestimonial = element.classList.contains('hero-block-inset-text')
    || element.querySelector('.component-v2-hero-block-inset-text');

  // Find parent inner container that holds all sibling columns
  const parent = element.closest('.component-layout-container__inner') || element.parentElement;

  let columns;
  if (isTestimonial) {
    // Testimonial: find all hero-block-inset-text siblings
    columns = Array.from(parent.querySelectorAll(':scope > .hero-block-inset-text'));
  } else {
    // Standard: find all layout-container siblings with tablet-wide--4 grid class
    columns = Array.from(
      parent.querySelectorAll(':scope > .layout-container[class*="aem-GridColumn--tablet-wide--4"]')
    );
  }

  // Build one row with all column cells
  const row = [];

  for (const col of columns) {
    const cellContent = document.createElement('div');

    if (isTestimonial) {
      // Testimonial column: extract from hero-block-inset-text structure
      const section = col.querySelector('section.component-v2-hero-block-inset-text');
      if (section) {
        // Check for background image (right-side image column)
        const bgImg = section.querySelector(':scope > img');
        const bodytext = section.querySelector('.component-v2-hero-block-inset-text__bodytext');
        const cta = section.querySelector('.cta-container a');

        if (bodytext) {
          const paras = bodytext.querySelectorAll('p');
          for (const p of paras) {
            const text = p.textContent.trim();
            if (text && text.length > 1) {
              cellContent.appendChild(p);
            }
          }
        }
        if (cta) {
          const p = document.createElement('p');
          p.appendChild(cta);
          cellContent.appendChild(p);
        }
        if (bgImg && !cellContent.hasChildNodes()) {
          // Image-only column (right side of testimonial)
          cellContent.appendChild(bgImg);
        }
      }
    } else {
      // Standard column: extract icon image, heading, description, CTA
      const images = col.querySelectorAll('img');
      const heading = col.querySelector('h3, h2');
      const textComponent = col.querySelectorAll('.component-v2-text-component');
      const ctaLink = col.querySelector('.cta-container a, section.component-v2-buttons a');

      // Add icon image
      for (const img of images) {
        const p = document.createElement('p');
        p.appendChild(img);
        cellContent.appendChild(p);
      }

      // Add heading
      if (heading) cellContent.appendChild(heading);

      // Add description paragraphs from text components (skip ones with images/headings already extracted)
      for (const tc of textComponent) {
        const paras = tc.querySelectorAll('p');
        for (const p of paras) {
          // Skip paragraphs that only contain images (already extracted) or are empty
          if (p.querySelector('img')) continue;
          const text = p.textContent.trim();
          if (text && text !== '\u00a0') {
            cellContent.appendChild(p);
          }
        }
      }

      // Add CTA button
      if (ctaLink) {
        const p = document.createElement('p');
        p.appendChild(ctaLink);
        cellContent.appendChild(p);
      }
    }

    row.push(cellContent);
  }

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);

  // Remove sibling column elements so they aren't parsed again
  for (const col of columns) {
    if (col !== element && col.parentElement) {
      col.remove();
    }
  }
}
