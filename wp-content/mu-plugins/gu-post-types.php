<?php

/**
 * Plugin Name: Growing Up NYC Post Types
 * Description: Custom post types and taxonomies
 * Version: 1.0.2
 * Author: Blue State Digital <http://www.bluestatedigital.com>
 */

class GUPostTypes {

  function __construct() {
    register_activation_hook( __FILE__, array( $this, 'activate' ) );
    add_action( 'init', array( $this, 'create_post_types' ) );
    add_action( 'init', array( $this, 'create_taxonomies' ) );
  }

  function activate() {
    $this->create_post_types();
    $this->create_taxonomies();
    $this->populate_taxonomies();
    flush_rewrite_rules();
  }

  function create_post_types() {
    register_post_type(
      'program',
      array(
        'labels' => array(
          'name' => 'Programs',
          'singular_name' => 'Program',
          'add_new_item' => 'Add New Program',
          'edit_item' => 'Edit Program',
          'new_item' => 'New Program',
          'view_item' => 'View Program',
          'search_items' => 'Search Programs',
          'not_found' => 'No programs found',
          'not_found_in_trash' => 'No programs found in trash',
          'all_items' => 'All Programs',
          'archives' => 'Program Archives',
          'insert_into_item' => 'Insert into program',
          'uploaded_to_this_item' => 'Uploaded to this program'
        ),
        'public' => true,
        'menu_position' => 21,
        'menu_icon' => 'dashicons-carrot',
        'show_in_rest' => true,
        'supports' => array( 'title', 'excerpt' ),
        'has_archive' => true,
        'rewrite' => array(
          'slug' => 'programs',
          'with_front' => false
        )
      )
    );

    register_post_type(
      'age',
      array(
        'labels' => array(
          'name' => 'Ages',
          'singular_name' => 'Age',
          'add_new_item' => 'Add New Age',
          'edit_item' => 'Edit Age',
          'new_item' => 'New Age',
          'view_item' => 'View Age',
          'search_items' => 'Search Ages',
          'not_found' => 'No ages found',
          'not_found_in_trash' => 'No ages found in trash',
          'all_items' => 'All Ages',
          'archives' => 'Age Archives',
          'insert_into_item' => 'Insert into age',
          'uploaded_to_this_item' => 'Uploaded to this age'
        ),
        'public' => true,
        'menu_position' => 22,
        'menu_icon' => 'dashicons-groups',
        'supports' => array( 'title', 'excerpt' ),
        'has_archive' => false,
        'rewrite' => array(
          'slug' => 'age',
          'with_front' => false
        )
      )
    );

    register_post_type(
      'banner',
      array(
        'labels' => array(
          'name' => 'Banners',
          'singular_name' => 'Banner',
          'add_new_item' => 'Add New Banner',
          'edit_item' => 'Edit Banner',
          'new_item' => 'New Banner',
          'view_item' => 'View Banner',
          'search_items' => 'Search Banners',
          'not_found' => 'No banners found',
          'not_found_in_trash' => 'No banners found in trash',
          'all_items' => 'All Banners',
          'archives' => 'Banner Archives',
          'insert_into_item' => 'Insert into banner',
          'uploaded_to_this_item' => 'Uploaded to this banner'
        ),
        'public' => true,
        'menu_position' => 23,
        'menu_icon' => 'dashicons-megaphone',
        'supports' => array( 'title' ),
        'has_archive' => false,
        'rewrite' => false
      )
    );

    register_post_type(
      'summer-guide',
      array(
        'labels' => array(
          'name' => 'Summer Guides',
          'singular_name' => 'Summer Guide',
          'add_new_item' => 'Add New Summer Guide',
          'edit_item' => 'Edit Summer Guide',
          'new_item' => 'New Summer Guide',
          'view_item' => 'View Summer Guide',
          'search_items' => 'Search Summer Guides',
          'not_found' =>  'No Summer Guides Found',
          'not_found_in_trash' => 'No Summer Guides found in trash',
          'all_items' => 'All Summer Guides',
          'archives' => 'Summer Guide Archives',
          'insert_into_item' => 'Insert into Summer Guide',
          'uploaded_to_this_item' => 'Uploaded to this Summer Guide'
        ),
        'public' => true,
        'menu_position' => 24,
        'menu_icon' => 'dashicons-palmtree',
        'supports' => array('title', 'excerpt', 'editor'),
        'has_archive' => true,
        'rewrite' => array(
          'slug' => 'summer',
          'with_front' => false
        )
      )
    );
  }

  function create_taxonomies() {
    register_taxonomy(
      'borough',
      array('tribe_events', 'summer-guide'),
      array(
        'label' => __( 'Event Location' ),
        'hierarchical' => true,
        'rewrite' => false,
        'show_in_rest' => true
      )
    );

    register_taxonomy(
      'age_group',
      array('age', 'tribe_events', 'program', 'summer-guide'),
      array(
        'label' => __( 'Age Groups' ),
        'hierarchical' => true,
        'rewrite' => false,
        'show_in_rest' => true
      )
    );

    register_taxonomy(
      'programs_cat',
      array('program'),
      array(
        'label' => __( 'Program Categories' ),
        'hierarchical' => true,
        'show_in_rest' => true
      )
    );

    register_taxonomy(
      'summer_programs_cat',
      array('summer-guide'),
      array(
        'label' => __( 'Program Categories' ),
        'hierarchical' => true,
        'rewrite' => false
      )
    );

    register_taxonomy(
      'time',
      array('summer-guide'),
      array(
        'label' => __( 'Times' ),
        'hierarchical' => true,
        'rewrite' => false
      )
    );
  }

  function populate_taxonomies() {
    if ( !term_exists( 'Bronx', 'borough' ) ) {
      wp_insert_term(
        'Bronx',
        'borough',
        array(
          'slug' => 'bronx'
        )
      );
    }

    if ( !term_exists( 'Brooklyn', 'borough' ) ) {
      wp_insert_term(
        'Brooklyn',
        'borough',
        array(
          'slug' => 'brooklyn'
        )
      );
    }

    if ( !term_exists( 'Manhattan', 'borough' ) ) {
      wp_insert_term(
        'Manhattan',
        'borough',
        array(
          'slug' => 'manhattan'
        )
      );
    }

    if ( !term_exists( 'Queens', 'borough' ) ) {
      wp_insert_term(
        'Queens',
        'borough',
        array(
          'slug' => 'queens'
        )
      );
    }

    if ( !term_exists( 'Staten Island', 'borough' ) ) {
      wp_insert_term(
        'Staten Island',
        'borough',
        array(
          'slug' => 'staten-island'
        )
      );
    }

    $age_groups = array(
      array( 'name' => 'Baby', 'description' => '0-11 months' ),
      array( 'name' => 'Toddler', 'description' => '1-3 years' ),
      array( 'name' => 'Pre-Schooler', 'description' => '4-5 years' ),
      array( 'name' => 'Grade Schooler', 'description' => '6-10 years' ),
      array( 'name' => 'Pre-Teen', 'description' => '11-12 years' )
    );
    foreach( $age_groups as $age_group ) {
      if ( !term_exists( $age_group['name'], 'age_group' ) ) {
        wp_insert_term( $age_group['name'], 'age_group', array(
          'description' => $age_group['description']
        ) );
      }
    }
  }
}
new GUPostTypes();
