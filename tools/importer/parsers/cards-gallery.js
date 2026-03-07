/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery.
 * Base: cards. Source: https://freewebsitetemplates.com/
 * Selectors from captured DOM: #fwtTemplatesList > ul > li
 * Each li contains: a > img (thumbnail), a > span (title), .option ul li a (action links)
 */
export default function parse(element, { document }) {
  // element is #fwtTemplatesList > ul
  const items = element.querySelectorAll(':scope > li');
  const cells = [];

  items.forEach((item) => {
    // Column 1: Image
    const img = item.querySelector(':scope > a > img');

    // Column 2: Title (as heading) + action links
    const titleSpan = item.querySelector(':scope > a > span');
    const actionLinks = Array.from(item.querySelectorAll('.option ul li a'));

    const contentCell = [];

    // Create heading from title span
    if (titleSpan) {
      const heading = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = titleSpan.textContent;
      heading.appendChild(strong);
      contentCell.push(heading);
    }

    // Add action links as paragraph
    if (actionLinks.length > 0) {
      const linksPara = document.createElement('p');
      actionLinks.forEach((link, index) => {
        if (index > 0) linksPara.append(' | ');
        linksPara.appendChild(link);
      });
      contentCell.push(linksPara);
    }

    // Add row: [image, content]
    if (img) {
      cells.push([img, contentCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
