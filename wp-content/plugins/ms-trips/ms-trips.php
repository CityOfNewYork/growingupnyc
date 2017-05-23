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
    'add_new_item' => 'Add New Trip',
    'edit_item' => 'Edit Trip',
    'new_item' => 'New Trip',
    'view_item' => 'View Trip',
    'search_items' => 'Search Trips',
    'not_found' =>  'No Trips Found',
    'not_found_in_trash' => 'No Trips found in Trash',
    'all_items' => 'All Trips',
    'archives' => 'Trip Archives',
    'insert_into_item' => 'Insert into trip',
    'uploaded_to_this_item' => 'Uploaded to this trip'
    );

  //register post type
  register_post_type( 'trip', array(
    'labels' => $labels,
    'public' => true,
    'menu_position' => 24,
    'menu_icon' => 'dashicons-groups',
    'supports' => array( 'title', 'excerpt', 'thumbnail'),
    'has_archive' => true,
    'rewrite' => array(
        'slug' => 'trips',
        'with_front' => false
      ),
    )
  );

	register_taxonomy(
    'trip_free_day_trip',
    array('trip',),
    array(
      'label' => __( 'Free day trip' ),
      'rewrite' => array(
        'slug' => 'trip-free-day-trip',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  
  register_taxonomy(
    'trip_free_this_week',
    array('trip',),
    array(
      'label' => __( 'Free this week' ),
      'rewrite' => array(
        'slug' => 'trip-free-this-week',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'trip_type',
    array('trip',),
    array(
      'label' => __( 'Trip type' ),
      'rewrite' => array(
        'slug' => 'trip-type',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );
}

add_action( 'init', 'ms_trips_create' );

?>	