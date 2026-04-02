/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero variant.
 * Base: hero
 * Source: https://www.directlinegroup.co.uk/en/index.html
 * Selector: .banner.imagecarousel .slideinner
 * Source structure: .slideinner with background-image, containing .carousel-text-inner > h1 and .carousel-links > a
 */
export default function parse(element, { document }) {
  // Extract background image from inline style
  const style = element.getAttribute('style') || '';
  const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
  let bgImage = null;
  if (bgMatch && bgMatch[1]) {
    let imgUrl = bgMatch[1];
    if (imgUrl.startsWith('/')) {
      imgUrl = 'https://www.directlinegroup.co.uk' + imgUrl;
    }
    bgImage = document.createElement('img');
    bgImage.src = imgUrl;
    bgImage.alt = '';
  }

  // Extract heading
  const heading = element.querySelector('.carousel-text-inner h1, .carousel-text-inner h2, .carousel-text h1');

  // Extract CTA links
  const ctaLinks = Array.from(element.querySelectorAll('.carousel-links a, .carousel-links span a'));

  // Build cells matching hero block structure:
  // Row 1: background image (optional)
  // Row 2: heading + CTA links
  const cells = [];

  if (bgImage) {
    cells.push([bgImage]);
  }

  const contentCell = [];
  if (heading) contentCell.push(heading);
  ctaLinks.forEach((link) => contentCell.push(link));
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero', cells });
  element.replaceWith(block);
}
