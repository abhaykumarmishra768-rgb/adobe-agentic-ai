/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: freewebsitetemplates.com cleanup.
 * Selectors from captured DOM of https://freewebsitetemplates.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie notice and Google ads before block parsing
    WebImporter.DOMUtils.remove(element, [
      '.PanelScroller.Notices',
      '.adsbygoogle',
      '.google-auto-placed',
      'ins.adsbygoogle',
      'iframe[src*="googleads"]',
      'iframe[src*="google.com/recaptcha"]',
      'iframe[src="about:blank"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content: header, footer, login, nav menus, pagination, calendar, popups
    WebImporter.DOMUtils.remove(element, [
      '#loginBar',
      'header',
      'footer',
      '.pageNavLinkGroup',
      '#calroot',
      '.Menu.JsOnly',
      '#NavigationHiddenMenu',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
