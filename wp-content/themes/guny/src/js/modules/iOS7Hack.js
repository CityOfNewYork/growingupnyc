/**
* iOS7 iPad Hack
* for hero image flickering issue.
*/

export default function() {
  if (navigator.userAgent.match(/iPad;.*CPU.*OS 7_\d/i)) {
	  $('.c-side-hero').height(window.innerHeight);
	  window.scrollTo(0, 0);
	}
}
