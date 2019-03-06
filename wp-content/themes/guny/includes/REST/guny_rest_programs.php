<?php 

//###########################################
// PROGRAMS
// register routes and fields for programs rest endpoint
add_action( 'rest_api_init', 'register_rest_programs' );
function register_rest_programs() {
  register_rest_field( 'program', 'age_group', array(
   'get_callback'    => 'get_rest_program_age_groups',
   'schema'          => null,
	));

	register_rest_field( 'program', 'programs_cat', array(
   'get_callback'    => 'get_rest_program_cat',
   'schema'          => null,
	));

	register_rest_field( 'program', 'title', array(
   'get_callback'    => 'get_rest_program_title',
   'schema'          => null,
	));

	register_rest_field( 'program', 'excerpt', array(
   'get_callback'    => 'get_rest_program_excerpt',
   'schema'          => null,
	));

	register_rest_route( 'wp/v2', 'programs_cat', array(
    'methods'  => WP_REST_Server::READABLE,
    'callback' => 'get_rest_program_types',
    'args' => array(
    	'term_id' => array(
    		'type' => 'integer'
    	)
    )
	));
}

// ###############
 
function get_rest_program_age_groups( $object ) {
  $post_id = $object['id'];

  $terms = wp_get_post_terms( $post_id, 'age_group' );

  foreach ($terms as &$term) { 
	  $term->name = htmlspecialchars_decode($term->name);
  }
 
  return $terms;
}

function get_rest_program_title( $object ) { 
  $post_title = html_entity_decode($object['title']['rendered']);
   
  return $post_title;
}

function get_rest_program_excerpt( $object ) { 
  $post_excerpt = strip_tags(html_entity_decode($object['excerpt']['rendered']));
   
  return $post_excerpt;
}


function get_rest_program_cat( $object ) {
  $post_id = $object['id'];

  $terms = wp_get_post_terms( $post_id, 'programs_cat' );

  foreach ($terms as &$term) { 
	  $term->name = htmlspecialchars_decode($term->name);
  }
   
  return $terms;
}


function get_rest_program_types() {

	$terms = get_terms( array(
    'taxonomy' => 'programs_cat',
    'hide_empty' => true,
	) );

  $terms_cleaned = array();

  foreach ($terms as &$term) {
    $term->name = htmlspecialchars_decode($term->name);
    array_push($terms_cleaned, $term);
  }

	return $terms_cleaned;
}