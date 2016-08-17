/**
* Cross-browser utility to fire events
* @param {object} elem - DOM element to fire event on
* @param {string} eventType - Event type, i.e. 'resize', 'click'
*/
export default function(elem, eventType) {
  let event;
  if (document.createEvent) {
    event = new Event(eventType);
    elem.dispatchEvent(event);
  } else {
    event = document.createEventObject();
    event.eventType = eventType;
    elem.fireEvent('on' + eventType, event);
  }
}
