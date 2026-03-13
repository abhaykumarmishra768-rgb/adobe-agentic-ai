/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import cardsServiceParser from './parsers/cards-service.js';
import columnsParser from './parsers/columns.js';

// TRANSFORMER IMPORTS
import btwCleanupTransformer from './transformers/btw-cleanup.js';
import btwSectionsTransformer from './transformers/btw-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'BT Wholesale main homepage with hero, services overview, and promotional content',
  urls: [
    'https://www.btwholesale.com/'
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['section.component-v2-hero-block-inset-text.full-width-breakout']
    },
    {
      name: 'cards-service',
      instances: ['.component-v2-product-service-grid']
    },
    {
      name: 'columns',
      instances: ['.layout-container.aem-GridColumn--tablet-wide--4', '.component-layout-container__indigo-gradient .hero-block-inset-text']
    }
  ],
  sections: [
    {
      id: 'section-2',
      name: 'Hero Banner',
      selector: '#main-content > .root > .aem-Grid > .responsivegrid > .aem-Grid > .experiencefragment:first-child',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-3',
      name: 'Partner with Wholesale',
      selector: '#main-content > .root > .aem-Grid > .responsivegrid > .aem-Grid > .experiencefragment:nth-child(2)',
      style: null,
      blocks: ['cards-service'],
      defaultContent: [
        '#main-content > .root > .aem-Grid > .responsivegrid > .aem-Grid > .experiencefragment:nth-child(2) .component-v2-text-component',
        '#main-content > .root > .aem-Grid > .responsivegrid > .aem-Grid > .experiencefragment:nth-child(2) section.component-v2-buttons'
      ]
    },
    {
      id: 'section-4',
      name: 'Teams Phone Mobile',
      selector: '#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(3)',
      style: null,
      blocks: ['hero'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'After Something Else',
      selector: '#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(4)',
      style: null,
      blocks: ['columns'],
      defaultContent: [
        '#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(4) .component-v2-text-component'
      ]
    },
    {
      id: 'section-6',
      name: 'Testimonials',
      selector: '#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(5)',
      style: 'indigo-gradient',
      blocks: ['columns'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Why BT Wholesale',
      selector: '#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(6)',
      style: null,
      blocks: ['columns'],
      defaultContent: [
        '#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(6) .component-v2-text-component:first-of-type',
        '#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(6) section.component-v2-buttons'
      ]
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'cards-service': cardsServiceParser,
  'columns': columnsParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  btwCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [btwSectionsTransformer] : []),
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
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
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

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path: path || '/index',
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
