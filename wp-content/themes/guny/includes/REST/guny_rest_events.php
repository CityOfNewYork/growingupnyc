<?php

// *********************************************
// add tribe_events endpoint to the rest API
// https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/
add_action( 'init', 'get_rest_tribe_events', 25 );

function get_rest_tribe_events() {
  global $wp_post_types;

  if( isset( $wp_post_types[ 'tribe_events' ] ) ) {
    $wp_post_types['tribe_events']->show_in_rest = true;
    $wp_post_types['tribe_events']->rest_base = 'tribe_events';
    $wp_post_types['tribe_events']->rest_controller_class = 'WP_REST_Posts_Controller';
  }
}

// *********************************************
// registering fields and routes for events
add_action( 'rest_api_init', 'register_rest_events' );
function register_rest_events() {
  register_rest_field( 'tribe_events', 'age_group', array(
   'get_callback'    => 'get_rest_events_age_groups',
   'schema'          => null
	));

	register_rest_field( 'tribe_events', 'tribe_events_cat', array(
   'get_callback'    => 'get_rest_events_tribe_events_cat',
   'schema'          => null
	));

	register_rest_field( 'tribe_events', 'borough', array(
   'get_callback'    => 'get_rest_events_borough',
   'schema'          => null
	));

	register_rest_field( 'tribe_events', 'start_date', array(
   'get_callback'    => 'get_rest_events_start_date',
   'schema'          => null
	));

	register_rest_field( 'tribe_events', 'end_date', array(
   'get_callback'    => 'get_rest_events_end_date',
   'schema'          => null
	));

	register_rest_field( 'tribe_events', 'title', array(
   'get_callback'    => 'get_rest_events_title',
   'schema'          => null,
	));

	register_rest_field( 'tribe_events', 'excerpt', array(
   'get_callback'    => 'get_rest_events_excerpt',
   'schema'          => null,
	));

	register_rest_route( 'wp/v2', 'tribe_events_cat', array(
	    'methods'  => WP_REST_Server::READABLE,
	    'callback' => 'update_rest_tribe_events_cat',
	));
}

// *********************************************
// updating the age_group field in the rest endpoint
function get_rest_events_age_groups( $object ) {
  $post_id = $object['id'];

  return wp_get_post_terms( $post_id, 'age_group' );
}

// *********************************************
// updating the tribe_events_cat field in the rest endpoint
function get_rest_events_tribe_events_cat( $object ) {
  $post_id = $object['id'];

  $terms = wp_get_post_terms( $post_id, 'tribe_events_cat' );

  foreach ($terms as &$term) { 
	  $term->name = htmlspecialchars_decode($term->name);
  }
 
  return $terms;
}

// *********************************************
// updating the age_group field in the rest endpoint
function get_rest_events_borough( $object ) {
  $post_id = $object['id'];

  return wp_get_post_terms( $post_id, 'borough' );
}

// *********************************************
// 
function get_rest_events_start_date( $object ) {
  $post_id = $object['id'];
 
  // return tribe_get_start_date($post_id, true, 'm-d-Y h:i:s');
  return tribe_get_start_date($post_id, true, 'm-d-Y');
}

// *********************************************
// 
function get_rest_events_end_date( $object ) {
  $post_id = $object['id'];
 
  return tribe_get_end_date($post_id, true, 'm-d-Y h:i:s');
}

function get_rest_events_title( $object ) { 
  $post_title = html_entity_decode($object['title']['rendered']);
   
  return $post_title;
}

function get_rest_events_excerpt( $object ) { 
  $post_excerpt = strip_tags(htmlspecialchars_decode($object['excerpt']['rendered']));
   
  return $post_excerpt;
}

function update_rest_tribe_events_cat() { 
 $terms = get_terms( array(
    'taxonomy' => 'tribe_events_cat',
    'hide_empty' => true,
	) );

	$terms_cleaned = clean_terms($terms);
	usort($terms_cleaned, function($a, $b) { 
    return strcmp($a->name, $b->name); 
  });

	return $terms_cleaned;
}


