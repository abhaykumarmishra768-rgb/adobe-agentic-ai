/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Direct Line Group cleanup.
 * Selectors from captured DOM of https://www.directlinegroup.co.uk/en/index.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent banner (OneTrust)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="onetrust"]',
      '#ot-sdk-btn-floating',
      '.ot-sdk-row',
    ]);

    // Remove alert banner at top of page
    WebImporter.DOMUtils.remove(element, ['.dg-alert']);

    // Remove scroll-down button (not authorable content)
    WebImporter.DOMUtils.remove(element, ['#downbutton']);

    // Remove carousel pager/hidden titles (slick carousel artifacts)
    WebImporter.DOMUtils.remove(element, [
      '.carousel-pager-wrapper',
      '.carousel-branding',
      '.hiddentitles',
    ]);

    // Remove empty article filter pane (insights section - dynamically loaded)
    WebImporter.DOMUtils.remove(element, ['section.insights-section']);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      'header.site-header-wrapper',
      'header',
      'footer.site-footer-wrapper',
      'footer',
      'nav',
      '#backingpanel',
      '.backinghighlight',
      '#navmenu',
      '#navmenumobile',
      '#navshares',
      '.mobilemenu',
      '.topnavmultimenu',
    ]);

    // Remove iframes, links (stylesheet), noscript
    WebImporter.DOMUtils.remove(element, ['iframe', 'link', 'noscript']);

    // Remove data attributes and tracking
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-slick-index');
      el.removeAttribute('data-emptytext');
      el.removeAttribute('aria-describedby');
      el.removeAttribute('tabindex');
      el.removeAttribute('adhocenable');
    });

    // Clean empty teaser-content divs
    element.querySelectorAll('.teaser-content').forEach((el) => {
      if (!el.textContent.trim()) el.remove();
    });

    // Clean clear:both divs
    element.querySelectorAll('div[style*="clear:both"], div[style*="clear: both"]').forEach((el) => el.remove());
  }
}
