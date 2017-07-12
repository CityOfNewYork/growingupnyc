<?php
/*
Plugin Name: ms-generic-page
Version: 1.0
Author: Smallaxe
Description: Generic page post types for Microsite
*/

function ms_generic_page_create() {
  // set up labels
  $labels = array(
    'name' => 'Generic Pages',
    'singular_name' => 'Generic',
    'add_new_item' => 'Add New Generic Page',
    'edit_item' => 'Edit Generic Page',
    'new_item' => 'New Generic Page',
    'view_item' => 'View Generic Page',
    'all_items' => 'All Generic Pages',
    'archives' => 'Generic Page Archives',
    'insert_into_item' => 'Insert into trip',
    'uploaded_to_this_item' => 'Uploaded to this trip'
    );

  //register post type
  register_post_type( 'generic-page', array(
    'labels' => $labels,
    'public' => true,
    'menu_position' => 25,
    'menu_icon' => 'dashicons-groups',
    'supports' => array( 'title', 'editor', 'excerpt', 'thumbnail'),
    'has_archive' => true,
    'rewrite' => array(
        'slug' => 'generic_page',
        'with_front' => false
      ),
    )
  );
}

add_action( 'init', 'ms_generic_page_create' );

?>	