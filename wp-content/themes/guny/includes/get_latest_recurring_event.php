<?

namespace Templating;

use GunyEvent;

/**
 * Gets the event or the latest event of a recurring event post by id.
 * @param  number $ID      The ID of the event
 * @param  number $number  The number of posts to retrieve
 * @return array           Collection of posts, false if tribe_events are disabled
 */

function get_latest_recurring_event($section_events) {
  // empty array for events
  $events=array();
  if (!function_exists('tribe_get_events')) return false;

  foreach ($section_events as &$value) {
    $event = array(
      'p' => $value['id'],
      'eventDisplay' => 'list',
      'meta_query'=> array(
        array(
          'key' => '_EventStartDate',
          'compare' => '>=', 
          'value' => date('Y-m-d H:i:s'),
          'type' => 'DATE'
        )
      ),
    );
    if(tribe_get_events( $event )){
      array_push($events, tribe_get_events( $event ));
    }
  }
  foreach($events as $i => $event) {
    $events[$i] = new GunyEvent($events[$i][0]);
  }
  return $events;
}

