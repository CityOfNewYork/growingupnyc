<?php
/*
Plugin Name: ms-topics
Version: 1.0
Author: Smallaxe
Description: Topics posttypes for Microsite
*/

function ms_topics_create() {
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
      'public' => true,
      'menu_position' => 24,
      'menu_icon' => 'dashicons-groups',
      'supports' => array( 'title', 'excerpt' ),
      'has_archive' => false,
      'rewrite' => array(
        'slug' => 'topic',
        'with_front' => false
      )
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
}

add_action( 'init', 'ms_topics_create' );

?>	