<?php
/*
Plugin Name: ms-trips
Version: 1.0
Author: Smallaxe
Description: Trips posttypes for Microsite
*/

function ms_trips_create() {
    // set up labels
  $labels = array(
    'name' => 'Trips',
      'singular_name' => 'Trip',
      'add_new' => 'Add New Trip',
      'add_new_item' => 'Add New Trip',
      'edit_item' => 'Edit Trip',
      'new_item' => 'New Trip',
      'all_items' => 'All Trips',
      'view_item' => 'View Trip',
      'search_items' => 'Search Trips',
      'not_found' =>  'No Trips Found',
      'not_found_in_trash' => 'No Trips found in Trash', 
      'parent_item_colon' => '',
      'menu_name' => 'Trips',
    );

      //register post type
  register_post_type( 'trip', array(
    'labels' => $labels,
    'has_archive' => true,
    'public' => true,
    'menu_position' => 24,
    'menu_icon' => 'dashicons-groups',
    'supports' => array( 'title', 'excerpt', 'thumbnail'),
    // 'taxonomies' => array( 'post_tag', 'category' ),  
    'exclude_from_search' => false,
    'capability_type' => 'post',
    'rewrite' => array(
        'slug' => 'trip',
        'with_front' => false
      ),
    )
  );

	register_taxonomy(
    'trip_group',
    array('trip',),
    array(
      'label' => __( 'Trip Groups' ),
      'rewrite' => array(
        'slug' => 'trip-group',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'trip_category',
    array('trip',),
    array(
      'label' => __( 'Trip Category' ),
      'rewrite' => array(
        'slug' => 'trip-category',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'trip_location',
    array('trip',),
    array(
      'label' => __( 'Trip Location' ),
      'rewrite' => array(
        'slug' => 'trip-location',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );
}

add_action( 'init', 'ms_trips_create' );

?>	