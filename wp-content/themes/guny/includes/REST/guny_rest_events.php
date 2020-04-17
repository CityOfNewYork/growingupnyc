<?php

/**
 * Tribe Events
 * Exposing taxonomies and advanced custom fields to the tribe/events/v1/events endpoint
 */
add_filter( 'tribe_rest_event_data', 'get_rest_events_borough' );
add_filter( 'tribe_rest_event_data', 'get_rest_events_age_groups' );
add_filter( 'tribe_rest_event_data', 'get_rest_events_google_map_link' );
add_filter( 'tribe_rest_event_data', 'get_rest_events_about_this_event' );
add_filter( 'tribe_rest_event_data', 'get_rest_events_date_formatted' );
add_filter( 'tribe_rest_event_data', 'get_rest_events_meta_data' );

/**
 * Taxonomy: Age Groups
 */
function get_rest_events_age_groups( $event ) {
  $event_id = $event['id'];
  $event['age_group'] = wp_get_post_terms($event_id, 'age_group');
  
  return $event;
}

/**
 * Taxonomy: Borough
 */
function get_rest_events_borough( $event ) {
  $event_id = $event['id'];	
    
  $event['borough'] = wp_get_post_terms($event_id, 'borough');
  return $event;
}

/**
 * Google Maps Link
 */
function get_rest_events_google_map_link( $event ) {
  $event_id = $event['id'];
  $event['google_map_link'] = html_entity_decode(tribe_get_map_link($event_id));
  return $event;
}

/**
 * About this event
 */
function get_rest_events_about_this_event( $event ) {
  $event_id = $event['id'];
  $event['about_this_event'] = html_entity_decode(get_field('summary', $event_id));
  return $event;
}

/**
 * Determine if the current time is before the end date
 */
function get_rest_events_date_formatted( $event ) {
  $event_id = $event['id'];
  $new_start_date = date('M d',strtotime(tribe_get_start_date($event_id, true,'Y-m-d h:i:s')));
  $new_start_day = date('D',strtotime(tribe_get_start_date($event_id, true,'Y-m-d h:i:s')));
  $new_end_date = date('M d',strtotime(tribe_get_end_date($event_id, true,'Y-m-d h:i:s')));
  $new_end_day = date('D',strtotime(tribe_get_end_date($event_id, true,'Y-m-d h:i:s')));

  if ( $new_start_date != $new_end_date) {
    $date_range = $new_start_date.' - '. $new_end_date;
  } else {
    $date_range = $new_start_date;
  }
  
  if (tribe_event_is_all_day($event_id)) {
    $new_time = "All Day";
  } else {
    $new_time = date('h:i a',strtotime(tribe_get_start_date($event_id, true,'Y-m-d h:i:s a'))).' - '.date('h:i a',strtotime(tribe_get_end_date($event_id, true,'Y-m-d h:i:s a')));
  }
  $event['date_formatted'] = [
    'start_day' => $new_start_day,
    'start_date' => $new_start_date,
    'end_day' => $new_end_day,
    'end_date' => $new_end_date,
    'date_range' => $date_range,
    'time' => $new_time
  ];

  return $event;
}

/**
 * Creates a string for the events that recur
 */
function get_rest_events_meta_data( $event ) {
  $event_id = $event['id'];
  $start_time = tribe_get_start_date($event_id, true,'g:ia');
  $end_time = tribe_get_end_date($event_id, true,'g:ia');
  $meta = get_post_meta( $event['id'], '_EventRecurrence', true );
  $days = array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');
  $val = array();

  foreach ($meta['rules'] as &$value) {
    if (array_key_exists("start-time", $value['custom'])) {
      if ($value['custom']['start-time'] == $start_time && $value['custom']['end-time'] == $end_time) {
        $val = array();
        for($i = 0; $i < count($value['custom']['week']['day']); ++$i) {
          array_push($val, $days[intval($value['custom']['week']['day'][$i])]);
        }
        $event['days_recurring'] = implode(", ", $val);
      }
    } else {
      for($i = 0; $i < count($value['custom']['week']['day']); ++$i) {
          array_push($val, $days[intval($value['custom']['week']['day'][$i])]);
        }
      $event['days_recurring'] = implode(", ", $val);
    }
  }

  return $event;
}

// allow per_page filter to go above 50 results
add_filter( 'tribe_rest_event_max_per_page', function() { return 250; } );