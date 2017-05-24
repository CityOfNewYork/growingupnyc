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
      'has_archive' => true,
      'public' => true,
      'menu_position' => 27,
      'menu_icon' => 'dashicons-groups',
      'supports' => array( 'title', 'excerpt' , 'thumbnail' ),
      'rewrite' => array(
        'slug' => 'topics',
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

  register_taxonomy(
    'resources_for',
    array('topic',),
    array(
      'label' => __( 'Resources For' ),
      'rewrite' => array(
        'slug' => 'resources-for',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'becoming_an_adult',
    array('topic',),
    array(
      'label' => __( 'Becoming An Adult' ),
      'rewrite' => array(
        'slug' => 'becoming-an-adult',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'counseling',
    array('topic',),
    array(
      'label' => __( 'Counseling' ),
      'rewrite' => array(
        'slug' => 'counseling',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'Going_to_school',
    array('topic',),
    array(
      'label' => __( 'Going to school' ),
      'rewrite' => array(
        'slug' => 'going-to-school',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'staying_healthy',
    array('topic',),
    array(
      'label' => __( 'Staying healthy' ),
      'rewrite' => array(
        'slug' => 'staying-healthy',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'working',
    array('topic',),
    array(
      'label' => __( 'Working' ),
      'rewrite' => array(
        'slug' => 'working',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

  register_taxonomy(
    'budgeting_and_finance',
    array('topic',),
    array(
      'label' => __( 'budgeting & finance' ),
      'rewrite' => array(
        'slug' => 'budgeting-and-finance',
        'with_front' => false
      ),
      'hierarchical' => true
    )
  );

}

add_action( 'init', 'ms_topics_create' );

?>	