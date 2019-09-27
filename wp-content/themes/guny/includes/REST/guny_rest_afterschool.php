<?php

/**
 * Afterschool WP Rest API
 */

/** #################################
 * Registering rest routes and fields
 */
add_action( 'rest_api_init', 'register_rest_afterschool' );
add_filter( 'rest_afterschool-guide_collection_params', 'filter_add_rest_orderby_params', 10, 1 );

function register_rest_afterschool() {
  register_rest_field( 'afterschool-guide', 'title', array(
   'get_callback'    => 'get_rest_afterschool_title',
   'schema'          => null,
  ));

  register_rest_field( 'afterschool-guide', 'excerpt', array(
   'get_callback'    => 'get_rest_afterschool_excerpt',
   'schema'          => null,
  ));

  register_rest_field( 'afterschool-guide', 'afterschool_programs_cat', array(
   'get_callback'    => 'get_rest_afterschool_cat',
   'schema'          => null,
  ));

  register_rest_field( 'afterschool-guide', 'age_group', array(
   'get_callback'    => 'get_rest_afterschool_age_groups',
   'schema'          => null,
  ));

  register_rest_field( 'afterschool-guide', 'location', array(
   'get_callback'    => 'get_rest_afterschool_google_map_link',
   'schema'          => null,
  ));

  register_rest_route( 'wp/v2', 'afterschool_programs_cat', array(
    'methods'  => WP_REST_Server::READABLE,
    'callback' => 'get_rest_afterschool_program_types',
    'args' => array(
      'term_id' => array(
        'type' => 'integer'
      )
    )
  ));

  register_rest_route( 'wp/v2', 'afterschool-guide_age_group', array(
    'methods'  => WP_REST_Server::READABLE,
    'callback' => 'get_rest_afterschool_age_groups_categories',
    'args' => array(
      'term_id' => array(
        'type' => 'integer'
      )
    )
  ));
}

/** #################
 * Callback functions
 */
function get_rest_afterschool_title( $object ) { 
  $post_title = html_entity_decode($object['title']['rendered']);
   
  return $post_title;
}

function get_rest_afterschool_excerpt( $object ) { 
  $post_excerpt = strip_tags(html_entity_decode($object['excerpt']['rendered']));
   
  return $post_excerpt;
}

function get_rest_afterschool_cat( $object ) {
  $post_id = $object['id'];

  $terms = wp_get_post_terms( $post_id, 'afterschool_programs_cat' );

  foreach ($terms as &$term) { 
    $term->name = htmlspecialchars_decode($term->name);
  }
   
  return $terms;
}

function get_rest_afterschool_age_groups( $object ) {
  $post_id = $object['id'];

  $terms = wp_get_post_terms( $post_id, 'age_group' );

  foreach ($terms as &$term) { 
    $term->name = htmlspecialchars_decode($term->name);
  }
 
  return $terms;
}

function get_rest_afterschool_google_map_link( $object ) {
	$loc_obj = new stdClass();

  preg_match('#\((.*?)\)#', $object['acf']['location_description'], $post_loc);
  preg_match('#\[(.*?)\]#', $object['acf']['location_description'], $post_loc_name);
  
  $loc_obj->google_map_link = $post_loc[1];
  $loc_obj->location_name = $post_loc_name[1];

	return $loc_obj;
}

function get_rest_afterschool_program_types() {

  $terms = get_terms( array(
    'taxonomy' => 'afterschool_programs_cat',
    'hide_empty' => true,
  ) );

  $terms_cleaned = array();

  foreach ($terms as &$term) {
    $term->name = htmlspecialchars_decode($term->name);
    array_push($terms_cleaned, $term);
  }

  return $terms_cleaned;
}

function get_rest_afterschool_age_groups_categories() {

  $terms = get_terms( array(
    'taxonomy' => 'age_group',
    'hide_empty' => true,
  ) );

  $terms_cleaned = array();

  foreach ($terms as &$term) {
    $term->name = htmlspecialchars_decode($term->name);

    $args = array(
        'post_type'     => 'afterschool-guide',
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