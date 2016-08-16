/**
* Parallax Hero
* @module modules/parallax
*/
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

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
  * Initialize parallax base
  * @param {object} base - DOM node for the base parallax element
  * @param {integer} initialTop - The initial top position to set
  */
  function initializeBase(base, initialTop) {
    base.style.top = initialTop + 'px';
    base.classList.add('o-parallax__base');
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
  * @param {integer} scrollPos - The current scroll position
  * @param {integer} baseHeight - The initial height of the element, used to calculate the new height
  * @param {integer} baseTop - The initial top position of the element, used to calculate the new position
  */
  function repaintHero(base, scrollPos, baseHeight, baseTop) {
    const newTop = baseTop - scrollPos;
    let newHeight = baseHeight - scrollPos;
    if (newHeight < 0) {
      newHeight = 0;
    }
    let opacity = (newHeight + newTop) / (baseHeight + baseTop);
    if (opacity < 0) {
      opacity = 0;
    }
    base.style.height = newHeight + 'px';
    base.style.top = newTop + 'px';
    base.firstElementChild.style.opacity = opacity;
  }

  /**
  * Adjust the content's top margin so that it appears to scroll upward
  * @param {object} content - DOM node for the inner content
  * @param {integer} scrollPos - The current scroll position
  */
  function repaintHeroContent(content, scrollPos) {
    const newMargin = 0 - scrollPos;
    content.style.marginTop = newMargin + 'px';
  }

  /**
  * Initialize parallax behavior
  * @param {object} parallaxBase - DOM element for the hero
  */
  function initialize(parallaxBase) {
    const parallaxContainer = parallaxBase.parentElement;
    const parallaxContent = parallaxBase.querySelector('.js-parallax-content');
    const baseHeight = parallaxBase.offsetHeight;
    const baseTop = parallaxBase.getBoundingClientRect().top;
    initializeContainer(parallaxContainer);
    initializeBase(parallaxBase, baseTop);
    calculateOffset(parallaxBase, parallaxContainer);

    window.addEventListener('resize', debounce(function() {
      calculateOffset(parallaxBase, parallaxContainer);
    }, 100));

    window.addEventListener('scroll', throttle(function() {
      const scrollPosition = scrollTop();
      repaintHero(parallaxBase, scrollPosition, baseHeight, baseTop);
      repaintHeroContent(parallaxContent, scrollPosition);
      calculateOffset(parallaxBase, parallaxContainer);
    }, 16));
  }

  const parallaxBase = document.querySelector('.js-parallax');
  if (parallaxBase) {
    initialize(parallaxBase);
  }
}
