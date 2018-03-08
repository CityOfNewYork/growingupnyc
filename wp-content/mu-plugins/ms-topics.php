<?php

/**
 * Plugin Name: ms-topics
 * Version: 1.0
 * Author: Smallaxe
 * Description: Topics posttypes for Microsite
 */

function ms_topics_create() {
  // set up labels
  $labels = array(
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
  );

  register_post_type('topic', array(
      'labels' => $labels,
      'has_archive' => 'generationnyc/topics',
      'public' => true,
      'menu_position' => 27,
      'menu_icon' => 'dashicons-groups',
      'supports' => array( 'title', 'excerpt' , 'thumbnail' ),
      'rewrite' => array(
        'slug' => 'generationnyc/topics'
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

  register_taxonomy(
    'other_category',
    array('program'),
    array(
      'label' => __( 'Other Category' ),
      'rewrite' => array(
        'slug' => 'other-category',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );
}

add_action( 'init', 'ms_topics_create' );