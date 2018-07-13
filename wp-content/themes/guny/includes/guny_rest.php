<?php

/**
* Expose custom fields to the rest api
*/

// Exposing custom fields and taxonomy to tribe/events endpoint
add_filter( 'tribe_rest_event_data', 'get_rest_events_fields' );
function get_rest_events_fields( array $event_data ) {
  $event_id = $event_data['id'];

  $fields = array(
		'featured_event',
		'accessibility',
		'summary',
		'event_photo',
		'location_details'
	);
  
  foreach ($fields as &$field) { 
    $event_data[$field] = get_post_meta( $event_id, $field, true );
	}

	$taxonomies = array(
		'age_group',
		'borough',
	);

	foreach ($taxonomies as &$taxonomy) { 
    $event_data[$taxonomy] = wp_get_post_terms( $event_id, $taxonomy );
	}

  return $event_data;
}