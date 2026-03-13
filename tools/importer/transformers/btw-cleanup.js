/* eslint-disable */
/* global WebImporter */

/**
 * BT Wholesale site-wide cleanup transformer.
 * Selectors from captured DOM of https://www.btwholesale.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent dialog (OneTrust)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter'
    ]);

    // Remove spacers (non-authorable layout elements)
    WebImporter.DOMUtils.remove(element, ['.component-spacer']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable: header, footer, skip-to-content, back-to-top
    WebImporter.DOMUtils.remove(element, [
      'header.component-bt-mega-nav',
      '.component-bt-mega-nav__top',
      '.component-bt-mega-nav__top-drawer',
      '.component-global-footer',
      '.component-jump-to-content',
      '.component-jump-to-content--opener',
      '#window_mediaDetector',
      '#back-to-top',
      '.component-back-to-top-link',
      'img[src^="blob:"]',
      'iframe',
      'link',
      'noscript'
    ]);

    // Remove empty links and lightbox artifacts
    element.querySelectorAll('a[href=""], a[href="#"]').forEach((a) => {
      const text = a.textContent.trim();
      if (!text || text === 'Back to top') a.closest('p')?.remove() || a.remove();
    });
  }
}
