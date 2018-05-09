<?

namespace Templating;

use GunyEvent;

/**
 * Gets the event or the latest event of a recurring event post by id.
 * @param  number $ID      The ID of the event
 * @param  number $number  The number of posts to retrieve
 * @return array           Collection of posts, false if tribe_events are disabled
 */
function get_latest_recurring_event($ID, $number = 1) {
  if (!function_exists('tribe_is_recurring_event'))
    return false;

  // If it is a recurring event but not the parent post
  if (tribe_is_recurring_event($ID) && wp_get_post_parent_id($ID) !== 0) {
    // Get the parent of the post
    $ID = wp_get_post_parent_id($ID);
  }

  $events = get_posts(array(
    'post_parent' => $ID,
    'meta_key' => '_EventStartDate',
    'orderby' => '_EventStartDate',
    'order' => 'DESC',
    'posts_per_page' => $number,
    'post_type' => 'tribe_events'
  ));

  foreach($events as $i => $event) {
    $events[$i] = new GunyEvent($events[$i]);
  }

  return $events;
}
