/**
* Parallax Hero
* @module modules/parallax
*/
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import dispatchEvent from './dispatchEvent.js';

export default function() {
  /**
  * Get the scroll position
  * @return {integer} - Amount window has been scrolled
  */
  function scrollTop() {
    const supportPageOffset = window.pageYOffset !== undefined;
    const isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
    return supportPageOffset ? window.pageYOffset :
      isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
  }

  /**
  * Initialize parallax container
  * @param {object} container - DOM node that wraps around the parallaxed elements
  */
  function initializeContainer(container) {
    container.classList.add('o-parallax');
  }

  /**
  * Remove modifications to parallax container
  * @param {object} container - DOM node that wraps around the parallaxed elements
  */
  function teardownContainer(container) {
    container.classList.remove('o-parallax');
    container.style.paddingTop = null;
  }

  /**
  * Initialize parallax base
  * @param {object} base - DOM node for the base parallax element
  * @param {integer} initialTop - The initial top position to set
  */
  function initializeBase(base, initialTop) {
    base.style.top = initialTop + 'px';
    base.classList.add('o-parallax__base');
  }

  /**
  * Remove modifications to parallax base
  * @param {object} base - DOM node for the base parallax element
  */
  function teardownBase(base) {
    base.style.top = null;
    base.style.height = null;
    base.classList.remove('o-parallax__base');
  }

  /**
  * Calculate hero offset
  * @param {object} elem - DOM node for the parallax element
  * @param {object} container - DOM node for the element's container
  */
  function calculateOffset(elem, container) {
    const offsetHeight = elem.offsetHeight;
    container.style.paddingTop = offsetHeight + 'px';
  }

  /**
  * Adjust the parallaxed element's height and position,
  * and the opacity of its children (the hero itself)
  * @param {object} base - The base (parallaxed) element
  * @param {integer} newHeight - The new height to set for base
  * @param {integer} newTop - The new top position to set for base
  */
  function repaintHero(base, newHeight, newTop) {
    base.style.height = newHeight + 'px';
    base.style.top = newTop + 'px';
  }

  /**
  * Adjust the element content's opacity and background position
  * @param {object} elem - The content element
  * @param {integer} scrollPos - The current scroll position
  * @param {float} opacity - The opacity value (between 0 and 1) to set
  */
  function repaintHeroContent(elem, scrollPos, opacity) {
    elem.style.opacity = opacity;
    if (window.matchMedia('(max-width:1023px)').matches) {
      const backgroundPosition = 0 - scrollPos;
      elem.style.backgroundPositionY = backgroundPosition + 'px';
    }
  }

  /**
  * Remove modifications to hero content
  * @param {object} elem - The content element
  */
  function teardownHeroContent(elem) {
    elem.style.opacity = null;
    elem.style.backgroundPositionY = null;
  }

  /**
  * Adjust the text content's top margin so that it appears to scroll upward
  * @param {object} content - DOM node for the inner content
  * @param {integer} scrollPos - The current scroll position
  */
  function repaintHeroText(content, scrollPos) {
    const newMargin = 0 - scrollPos;
    content.style.marginTop = newMargin + 'px';
  }

  /**
  * Remove modifications to hero text
  * @param {object} content - DOM node for the inner content
  */
  function teardownHeroText(content) {
    content.style.marginTop = null;
  }

  /**
  * Initialize parallax behavior
  * @param {object} parallaxBase - DOM element for the hero
  */
  function initialize(parallaxBase) {
    const parallaxContainer = parallaxBase.parentElement;
    const parallaxContent = parallaxBase.querySelector('.js-parallax-content');
    const parallaxText = parallaxBase.querySelector('.js-parallax-text');
    const baseHeight = parallaxBase.offsetHeight;
    const baseTop = parallaxBase.getBoundingClientRect().top;
    initializeContainer(parallaxContainer);
    initializeBase(parallaxBase, baseTop);

    const scrollListener = window.addEventListener('scroll', throttle(function() {
      const scrollPosition = scrollTop();
      const newHeight = (baseHeight - scrollPosition < 0) ? 0 : (baseHeight - scrollPosition);
      const newTop = baseTop - scrollPosition;
      let opacity = (newHeight + newTop) / (baseHeight + baseTop);
      opacity = opacity < 0 ? 0 : opacity;
      repaintHero(parallaxBase, newHeight, newTop);
      repaintHeroContent(parallaxContent, scrollPosition, opacity);
      repaintHeroText(parallaxText, scrollPosition);
      calculateOffset(parallaxBase, parallaxContainer);
    }, 16));

    const resizeListener = window.addEventListener('resize', debounce(function() {
      window.removeEventListener('scroll', scrollListener);
      window.removeEventListener('resize', resizeListener);
      teardownContainer(parallaxContainer);
      teardownBase(parallaxBase);
      teardownHeroContent(parallaxContent);
      teardownHeroText(parallaxText);
      initialize(parallaxBase);
    }, 100));

    dispatchEvent(window, 'scroll');
  }

  const parallaxBase = document.querySelector('.js-parallax');
  if (parallaxBase) {
    initialize(parallaxBase);
  }
}
