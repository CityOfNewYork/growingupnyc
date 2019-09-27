<?php 

//###########################################
// PROGRAMS
// register routes and fields for programs rest endpoint
add_action( 'rest_api_init', 'register_rest_programs' );
add_filter( 'rest_program_collection_params', 'filter_add_rest_orderby_params', 10, 1 );

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

  register_rest_route( 'wp/v2', 'program_age_group', array(
    'methods'  => WP_REST_Server::READABLE,
    'callback' => 'get_rest_program_age_groups_categories',
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

function get_rest_program_age_groups_categories() {

  $terms = get_terms( array(
    'taxonomy' => 'age_group',
    'hide_empty' => true,
  ) );

  $terms_cleaned = array();

  foreach ($terms as &$term) {
    $term->name = htmlspecialchars_decode($term->name);

    $args = array(
        'post_type'     => 'program',
        'post_status'   => 'publish',
        'posts_per_page' => -1,
        'tax_query' => array(
          'relation' => 'AND',
          array(
            'taxonomy' => 'age_group',
            'field' => 'term_id',
            'terms' => $term->term_id
          )
        )
      );

    $query = new WP_Query( $args);
    if(count($query->posts) > 0) {
      $term->count = count($query->posts);
      array_push($terms_cleaned, $term);
    }
  }
  
  return $terms_cleaned;
}