<?

namespace Templating;

use GunyEvent;

/**
 * Gets the event or the latest event of a recurring event post by id.
 * @param  number $ID      The ID of the event
 * @param  number $number  The number of posts to retrieve
 * @return array           Collection of posts, false if tribe_events are disabled
 */

function get_related_events($section_events) {
  // empty array for events
  $events=array();
  if (!function_exists('tribe_get_events')) return false;
  
  // loop through each event
  foreach ($section_events as &$value) {
    $ID = $value['id'];
    $count=$value['count'];

    // Recurring
    if (tribe_is_recurring_event($ID)) {
      // not parent
      if(wp_get_post_parent_id($ID) !== 0) {
        $ID = wp_get_post_parent_id($ID);
      }

      // check to see if the parent can be included
      $event=get_single_event($ID);
      array_push($events, tribe_get_events($event)[0]);

      if($event && $count > 1 ){
        $recurring_events = get_latest_recurring_event($ID, $count);
        foreach ($recurring_events as &$recurring_event) {
          array_push($events, $recurring_event);
        }
      } 
    } else{ //not recurring
      $event = get_single_event($ID);
      if(tribe_get_events($event)){
        array_push($events, tribe_get_events($event)[0]);          
      }
    }
  }
  
  // sort the events
  usort($events, function($a, $b) { 
    return strcmp($a->EventStartDate, $b->EventStartDate); 
  });
  
  foreach($events as $i => $event) {
    $events[$i] = new GunyEvent($events[$i]);
  }
  return $events;
}

function get_latest_recurring_event($event_id, $number = 1) {
  // get the ids of the parent's children events
  $events = tribe_get_events(array(
    'post_parent' => $event_id,
    'meta_key' => '_EventStartDate',
    'orderby' => '_EventStartDate',
    'order' => 'ASC',
    'posts_per_page' => $number,
    'start_date' => date('Y-m-d H:i:s')
  ));
  return $events;
}

function get_single_event($event_id) {
    $event = array(
      'p' => $event_id,
      'eventDisplay' => 'list',
      'meta_query'=> array(
        array(
          'key' => '_EventStartDate',
          'compare' => '>=', 
          'value' => date('Y-m-d H:i:s'),
          'type' => 'DATE'
        )
      )
    );
  return $event;
}