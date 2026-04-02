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
  function parse(element, { document }) {
    const style = element.getAttribute("style") || "";
    const bgMatch = style.match(/background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/);
    let bgImage = null;
    if (bgMatch && bgMatch[1]) {
      let imgUrl = bgMatch[1];
      if (imgUrl.startsWith("/")) {
        imgUrl = "https://www.directlinegroup.co.uk" + imgUrl;
      }
      bgImage = document.createElement("img");
      bgImage.src = imgUrl;
      bgImage.alt = "";
    }
    const heading = element.querySelector(".carousel-text-inner h1, .carousel-text-inner h2, .carousel-text h1");
    const ctaLinks = Array.from(element.querySelectorAll(".carousel-links a, .carousel-links span a"));
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
    const block = WebImporter.Blocks.createBlock(document, { name: "hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-brand.js
  function parse2(element, { document }) {
    const inner = element.querySelector(".teaser-inner") || element;
    const img = inner.querySelector(".image-wrapper img, .cq-dd-teaserimage, img");
    const heading = inner.querySelector("h2");
    const ctaLink = inner.querySelector(".link-wrapper a, a.internal");
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (ctaLink && ctaLink !== (heading == null ? void 0 : heading.querySelector("a"))) {
      contentCell.push(ctaLink);
    }
    const cells = [];
    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : "", contentCell.length > 0 ? contentCell : ""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-stats.js
  function parse3(element, { document }) {
    const heading = element.querySelector("h2");
    const columns = element.querySelectorAll(
      '.parsys_column[class*="33-33-33-c0"], .parsys_column[class*="33-33-33-c1"], .parsys_column[class*="33-33-33-c2"]'
    );
    const viewMoreLink = element.querySelector('a[href*="group-profile"]');
    const footnotes = element.querySelector(".text.parbase sup");
    const cells = [];
    columns.forEach((col) => {
      const label = col.querySelector(".text.parbase p, .default p");
      const value = col.querySelector(".statistic-title h3, .statistic-title span");
      const description = col.querySelector(".statistic-text1");
      const row = [];
      if (label) row.push(label);
      if (value) row.push(value);
      if (description) row.push(description);
      if (row.length > 0) {
        cells.push(row);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/directlinegroup-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="onetrust"]',
        "#ot-sdk-btn-floating",
        ".ot-sdk-row"
      ]);
      WebImporter.DOMUtils.remove(element, [".dg-alert"]);
      WebImporter.DOMUtils.remove(element, ["#downbutton"]);
      WebImporter.DOMUtils.remove(element, [
        ".carousel-pager-wrapper",
        ".carousel-branding",
        ".hiddentitles"
      ]);
      WebImporter.DOMUtils.remove(element, ["section.insights-section"]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header.site-header-wrapper",
        "header",
        "footer.site-footer-wrapper",
        "footer",
        "nav",
        "#backingpanel",
        ".backinghighlight",
        "#navmenu",
        "#navmenumobile",
        "#navshares",
        ".mobilemenu",
        ".topnavmultimenu"
      ]);
      WebImporter.DOMUtils.remove(element, ["iframe", "link", "noscript"]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-slick-index");
        el.removeAttribute("data-emptytext");
        el.removeAttribute("aria-describedby");
        el.removeAttribute("tabindex");
        el.removeAttribute("adhocenable");
      });
      element.querySelectorAll(".teaser-content").forEach((el) => {
        if (!el.textContent.trim()) el.remove();
      });
      element.querySelectorAll('div[style*="clear:both"], div[style*="clear: both"]').forEach((el) => el.remove());
    }
  }

  // tools/importer/transformers/directlinegroup-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload || {};
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionEl.nextSibling) {
            sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
          } else {
            sectionEl.parentNode.appendChild(sectionMetadata);
          }
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "cards-brand": parse2,
    "columns-stats": parse3
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Direct Line Group corporate homepage with hero, key metrics, news, and investor information",
    urls: [
      "https://www.directlinegroup.co.uk/en/index.html"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".banner.imagecarousel .slideinner"]
      },
      {
        name: "cards-brand",
        instances: [".carousels-par .pageteaser", ".parsys_column.column_3_33-33-33 .pageteaser"]
      },
      {
        name: "columns-stats",
        instances: [".teaser-inner.plain-background"]
      }
    ],
    sections: [
      {
        id: "section-1-hero",
        name: "Hero Banner",
        selector: ".banner.imagecarousel",
        style: "dark",
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2-brands",
        name: "Our Brands",
        selector: "section.brand-section",
        style: null,
        blocks: ["cards-brand"],
        defaultContent: [".brand-page-teaser h2", ".brand-page-teaser .teaser-content p"]
      },
      {
        id: "section-3-glance",
        name: "DLG At A Glance",
        selector: "section.main-section .teaser.parbase:first-child",
        style: null,
        blocks: ["columns-stats"],
        defaultContent: []
      },
      {
        id: "section-4-latest",
        name: "Our Latest",
        selector: ["section.main-section .main-par > .text.parbase", "section.main-section .parsys_column.column_3_33-33-33"],
        style: null,
        blocks: ["cards-brand"],
        defaultContent: [".main-par > .text.parbase h2"]
      }
    ]
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
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
