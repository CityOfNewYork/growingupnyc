<?php

/**
 * Plugin Name: Generation NYC Post Types
 * Description: Custom post types and taxonomies for Generation NYC
 * Author: NYC Opportunity
 */

/**
 * Post Types
 */
add_action('init', function() {
  register_post_type(
    'topic', 
    array(
      'labels' => array(
        'name' => 'Topics',
        'singular_name' => 'Topic',
        'add_new_item' => 'Add New Topic',
        'edit_item' => 'Edit Topic',
        'new_item' => 'New Topic',
        'view_item' => 'View Topic',
        'search_items' => 'Search Topics',
        'not_found' => 'No topics found',
        'not_found_in_trash' => 'No topics found in trash',
        'all_items' => 'All Topics',
        'archives' => 'Topic Archives',
        'insert_into_item' => 'Insert into topic',
        'uploaded_to_this_item' => 'Uploaded to this topic'
      ),
      'has_archive' => 'generationnyc/topics',
      'public' => true,
      'menu_position' => 27,
      'menu_icon' => get_template_directory_uri().'/assets/img/gnyc-admin-icon.png',
      'supports' => array( 'title', 'excerpt' , 'thumbnail' ),
      'rewrite' => array(
        'slug' => 'generationnyc/topics'
      )
    )
  );

  register_post_type(
    'inspiration',
    array(
      'labels' => array(
        'name' => 'Inspirations',
        'singular_name' => 'Inspiration',
        'add_new' => 'Add New Inspiration',
        'add_new_item' => 'Add New Inspiration',
        'edit_item' => 'Edit Inspiration',
        'new_item' => 'New Inspiration',
        'all_items' => 'All Inspirations',
        'view_item' => 'View Inspiration',
        'search_items' => 'Search Inspirations',
        'not_found' =>  'No Inspirations Found',
        'not_found_in_trash' => 'No Inspirations found in Trash',
        'parent_item_colon' => '',
        'menu_name' => 'Inspirations',
      ),
      'has_archive' => 'generationnyc/inspirations',
      'public' => true,
      'menu_position' => 26,
      'menu_icon' => get_template_directory_uri().'/assets/img/gnyc-admin-icon.png',
      'supports' => array( 'title', 'excerpt', 'thumbnail'),
      'exclude_from_search' => false,
      'rewrite' => array(
        'slug' => 'generationnyc/inspirations'
      ),
    )
  );

  register_post_type( 
    'trip', 
    array(
      'labels' => array(
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
      ),
      'public' => true,
      'menu_position' => 24,
      'menu_icon' => get_template_directory_uri().'/assets/img/gnyc-admin-icon.png',
      'supports' => array( 'title', 'excerpt', 'thumbnail'),
      'has_archive' => 'generationnyc/trips',
      'rewrite' => array(
        'slug' => 'generationnyc/trips'
      )
    )
  );
});

/**
 * Taxonomies
 */
add_action('init', function() {
  register_taxonomy(
    'inspiration_group',
    array('inspiration',),
    array(
      'label' => __( 'Inspiration Groups' ),
      'rewrite' => array(
        'slug' => 'inspiration-group',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'topic_group',
    array('topic',),
    array(
      'label' => __( 'Topic Groups' ),
      'rewrite' => array(
        'slug' => 'topic-group',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'other_category',
    array('program'),
    array(
      'label' => __( 'Other Category' ),
      'rewrite' => array(
        'slug' => 'other-category',
        'with_front' => false
      ),
      'hierarchical' => true,
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
});


