/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsBrandParser from './parsers/cards-brand.js';
import columnsStatsParser from './parsers/columns-stats.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/directlinegroup-cleanup.js';
import sectionsTransformer from './transformers/directlinegroup-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'cards-brand': cardsBrandParser,
  'columns-stats': columnsStatsParser,
};

// PAGE TEMPLATE CONFIGURATION (embedded from page-templates.json)
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Direct Line Group corporate homepage with hero, key metrics, news, and investor information',
  urls: [
    'https://www.directlinegroup.co.uk/en/index.html',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.banner.imagecarousel .slideinner'],
    },
    {
      name: 'cards-brand',
      instances: ['.carousels-par .pageteaser', '.parsys_column.column_3_33-33-33 .pageteaser'],
    },
    {
      name: 'columns-stats',
      instances: ['.teaser-inner.plain-background'],
    },
  ],
  sections: [
    {
      id: 'section-1-hero',
      name: 'Hero Banner',
      selector: '.banner.imagecarousel',
      style: 'dark',
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2-brands',
      name: 'Our Brands',
      selector: 'section.brand-section',
      style: null,
      blocks: ['cards-brand'],
      defaultContent: ['.brand-page-teaser h2', '.brand-page-teaser .teaser-content p'],
    },
    {
      id: 'section-3-glance',
      name: 'DLG At A Glance',
      selector: 'section.main-section .teaser.parbase:first-child',
      style: null,
      blocks: ['columns-stats'],
      defaultContent: [],
    },
    {
      id: 'section-4-latest',
      name: 'Our Latest',
      selector: ['section.main-section .main-par > .text.parbase', 'section.main-section .parsys_column.column_3_33-33-33'],
      style: null,
      blocks: ['cards-brand'],
      defaultContent: ['.main-par > .text.parbase h2'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((el) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element: el,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
