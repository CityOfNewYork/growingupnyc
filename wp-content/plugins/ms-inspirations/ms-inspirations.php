<?php
/*
Plugin Name: ms-inspirations
Version: 1.0
Author: Smallaxe
Description: Inspirations posttypes for Microsite
*/

function ms_inspirations_create() {
    // set up labels
  $labels = array(
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
    );

      //register post type
  register_post_type( 'inspiration', array(
    'labels' => $labels,
    'has_archive' => true,
    'public' => true,
    'menu_position' => 24,
    'menu_icon' => 'dashicons-groups',
    'supports' => array( 'title', 'editor', 'excerpt', 'custom-fields', 'thumbnail','page-attributes' ),
    'taxonomies' => array( 'post_tag', 'category' ),  
    'exclude_from_search' => false,
    'capability_type' => 'post',
    'rewrite' => array(
        'slug' => 'inspirations',
        'with_front' => false
      ),
    )
  );

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
}

add_action( 'init', 'ms_inspirations_create' );

?>	