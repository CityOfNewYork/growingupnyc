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

//###########################################
// AGE GROUPS
add_action( 'rest_api_init', 'register_age_group_route');
function register_age_group_route() {
	register_rest_route( 'tribe/events/v1', 'age_group', array(
	    'methods'  => WP_REST_Server::READABLE,
	    'callback' => 'get_event_age_groups',
	    'args' => array(
	    	'term_id' => array(
	    		'type' => 'integer'
	    	)
	    )
	));

	// single age_group
	register_rest_route( 'tribe/events/v1', 'age_group/(?P<id>\d+)', array(
    'methods'  => WP_REST_Server::READABLE,
    'callback' => 'get_single_age_group',
	));
}

function get_event_age_groups() {

	$categories = get_terms( array(
    'taxonomy' => 'age_group',
    'hide_empty' => false,
	) );

	$age_group['total'] = count($categories);
	$age_group['age_group'] = $categories;

	return $age_group;
}

function get_single_age_group($age_group) {

	return get_term($age_group['id']);
}


//###########################################
// BOROUGHS
add_action( 'rest_api_init', 'register_borough_route');
function register_borough_route() {
	register_rest_route( 'tribe/events/v1', 'borough', array(
	    'methods'  => WP_REST_Server::READABLE,
	    'callback' => 'get_event_boroughs',
	));
}

function get_event_boroughs() {

	$categories = get_terms( array(
    'taxonomy' => 'borough',
    'hide_empty' => false,
	) );

	$borough['total'] = count($categories);
	$borough['borough'] = $categories;

	return $borough;
}

//###########################################
// PROGRAMS
// register routes and fields for programs rest endpoint
add_action( 'rest_api_init', 'register_rest_programs_routes' );
function register_rest_programs_routes() {
 
  register_rest_field( 'program', 'age_group', array(
   'get_callback'    => 'get_rest_program_age_groups',
   'schema'          => null,
	));
}
 
function get_rest_program_age_groups( $object ) {
  $post_id = $object['id'];
 
  return wp_get_post_terms( $post_id, 'age_group' );
}





