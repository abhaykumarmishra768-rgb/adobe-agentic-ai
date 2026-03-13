var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document: document2 }) {
    let bgImage = element.querySelector(":scope > img");
    if (!bgImage) {
      const allImages = element.querySelectorAll("img");
      for (const img of allImages) {
        if (!img.closest(".component-v2-hero-block-inset-text__bodytext") && !img.closest(".cta-container")) {
          bgImage = img;
          break;
        }
      }
    }
    const heading = element.querySelector(".component-v2-hero-block-inset-text__bodytext h1, .component-v2-hero-block-inset-text__bodytext h2");
    const bodytext = element.querySelector(".component-v2-hero-block-inset-text__bodytext");
    let description = null;
    if (bodytext) {
      const paragraphs = bodytext.querySelectorAll("p");
      for (const p of paragraphs) {
        const text = p.textContent.trim();
        if (text && text.length > 1) {
          description = p;
          break;
        }
      }
    }
    const cta = element.querySelector(".cta-container a");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentContainer = document2.createElement("div");
    if (heading) contentContainer.appendChild(heading);
    if (description) contentContainer.appendChild(description);
    if (cta) {
      const p = document2.createElement("p");
      p.appendChild(cta);
      contentContainer.appendChild(p);
    }
    cells.push([contentContainer]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse2(element, { document: document2 }) {
    if (!element.parentElement) return;
    const allCards = Array.from(document2.querySelectorAll(".component-v2-product-service-grid"));
    if (allCards.length > 1 && allCards[0] !== element) {
      element.remove();
      return;
    }
    const cells = [];
    for (const card of allCards) {
      const img = card.querySelector("img");
      const title = card.querySelector("figcaption h2, h2");
      const bodyDiv = card.querySelector(".component-v2-product-service-grid__bodytext");
      const ctaLink = card.querySelector("footer.cta-container a, .cta-container a");
      const textCell = document2.createElement("div");
      if (title) textCell.appendChild(title);
      if (bodyDiv) {
        const paras = bodyDiv.querySelectorAll("p");
        for (const p of paras) {
          const text = p.textContent.trim();
          if (text && text !== "\xA0") {
            textCell.appendChild(p);
          }
        }
      }
      if (ctaLink) {
        const p = document2.createElement("p");
        p.appendChild(ctaLink);
        textCell.appendChild(p);
      }
      cells.push([img || "", textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-service", cells });
    element.replaceWith(block);
    for (const card of allCards) {
      if (card !== element) {
        const wrapper = card.closest(".product-service-grid");
        if (wrapper && wrapper.parentElement) {
          wrapper.remove();
        } else if (card.parentElement) {
          card.remove();
        }
      }
    }
  }

  // tools/importer/parsers/columns.js
  function parse3(element, { document: document2 }) {
    if (!element.parentElement) return;
    const isTestimonial = element.classList.contains("hero-block-inset-text") || element.querySelector(".component-v2-hero-block-inset-text");
    const parent = element.closest(".component-layout-container__inner") || element.parentElement;
    let columns;
    if (isTestimonial) {
      columns = Array.from(parent.querySelectorAll(":scope > .hero-block-inset-text"));
    } else {
      columns = Array.from(
        parent.querySelectorAll(':scope > .layout-container[class*="aem-GridColumn--tablet-wide--4"]')
      );
    }
    const row = [];
    for (const col of columns) {
      const cellContent = document2.createElement("div");
      if (isTestimonial) {
        const section = col.querySelector("section.component-v2-hero-block-inset-text");
        if (section) {
          const bgImg = section.querySelector(":scope > img");
          const bodytext = section.querySelector(".component-v2-hero-block-inset-text__bodytext");
          const cta = section.querySelector(".cta-container a");
          if (bodytext) {
            const paras = bodytext.querySelectorAll("p");
            for (const p of paras) {
              const text = p.textContent.trim();
              if (text && text.length > 1) {
                cellContent.appendChild(p);
              }
            }
          }
          if (cta) {
            const p = document2.createElement("p");
            p.appendChild(cta);
            cellContent.appendChild(p);
          }
          if (bgImg && !cellContent.hasChildNodes()) {
            cellContent.appendChild(bgImg);
          }
        }
      } else {
        const images = col.querySelectorAll("img");
        const heading = col.querySelector("h3, h2");
        const textComponent = col.querySelectorAll(".component-v2-text-component");
        const ctaLink = col.querySelector(".cta-container a, section.component-v2-buttons a");
        for (const img of images) {
          const p = document2.createElement("p");
          p.appendChild(img);
          cellContent.appendChild(p);
        }
        if (heading) cellContent.appendChild(heading);
        for (const tc of textComponent) {
          const paras = tc.querySelectorAll("p");
          for (const p of paras) {
            if (p.querySelector("img")) continue;
            const text = p.textContent.trim();
            if (text && text !== "\xA0") {
              cellContent.appendChild(p);
            }
          }
        }
        if (ctaLink) {
          const p = document2.createElement("p");
          p.appendChild(ctaLink);
          cellContent.appendChild(p);
        }
      }
      row.push(cellContent);
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns", cells });
    element.replaceWith(block);
    for (const col of columns) {
      if (col !== element && col.parentElement) {
        col.remove();
      }
    }
  }

  // tools/importer/transformers/btw-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      WebImporter.DOMUtils.remove(element, [".component-spacer"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.component-bt-mega-nav",
        ".component-bt-mega-nav__top",
        ".component-bt-mega-nav__top-drawer",
        ".component-global-footer",
        ".component-jump-to-content",
        ".component-jump-to-content--opener",
        "#window_mediaDetector",
        "#back-to-top",
        ".component-back-to-top-link",
        'img[src^="blob:"]',
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll('a[href=""], a[href="#"]').forEach((a) => {
        var _a;
        const text = a.textContent.trim();
        if (!text || text === "Back to top") ((_a = a.closest("p")) == null ? void 0 : _a.remove()) || a.remove();
      });
    }
  }

  // tools/importer/transformers/btw-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const doc = element.ownerDocument || document;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectorList = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectorList) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0 && sectionEl.previousElementSibling) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "BT Wholesale main homepage with hero, services overview, and promotional content",
    urls: [
      "https://www.btwholesale.com/"
    ],
    blocks: [
      {
        name: "hero",
        instances: ["section.component-v2-hero-block-inset-text.full-width-breakout"]
      },
      {
        name: "cards-service",
        instances: [".component-v2-product-service-grid"]
      },
      {
        name: "columns",
        instances: [".layout-container.aem-GridColumn--tablet-wide--4", ".component-layout-container__indigo-gradient .hero-block-inset-text"]
      }
    ],
    sections: [
      {
        id: "section-2",
        name: "Hero Banner",
        selector: "#main-content > .root > .aem-Grid > .responsivegrid > .aem-Grid > .experiencefragment:first-child",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Partner with Wholesale",
        selector: "#main-content > .root > .aem-Grid > .responsivegrid > .aem-Grid > .experiencefragment:nth-child(2)",
        style: null,
        blocks: ["cards-service"],
        defaultContent: [
          "#main-content > .root > .aem-Grid > .responsivegrid > .aem-Grid > .experiencefragment:nth-child(2) .component-v2-text-component",
          "#main-content > .root > .aem-Grid > .responsivegrid > .aem-Grid > .experiencefragment:nth-child(2) section.component-v2-buttons"
        ]
      },
      {
        id: "section-4",
        name: "Teams Phone Mobile",
        selector: "#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(3)",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "After Something Else",
        selector: "#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(4)",
        style: null,
        blocks: ["columns"],
        defaultContent: [
          "#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(4) .component-v2-text-component"
        ]
      },
      {
        id: "section-6",
        name: "Testimonials",
        selector: "#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(5)",
        style: "indigo-gradient",
        blocks: ["columns"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Why BT Wholesale",
        selector: "#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(6)",
        style: null,
        blocks: ["columns"],
        defaultContent: [
          "#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(6) .component-v2-text-component:first-of-type",
          "#main-content .root > .aem-Grid > .responsivegrid > .aem-Grid > :nth-child(6) section.component-v2-buttons"
        ]
      }
    ]
  };
  var parsers = {
    "hero": parse,
    "cards-service": parse2,
    "columns": parse3
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, html, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path: path || "/index",
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
