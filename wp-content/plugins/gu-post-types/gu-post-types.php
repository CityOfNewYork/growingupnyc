<?php
/**
* Plugin Name: Growing Up NYC Post Types
* Description: Custom post types and taxonomies
* Version: 1.0.1
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
        'supports' => array( 'title', 'editor', 'excerpt' )
      )
    );

    register_post_type(
      'age',
      array(
        'label' => 'Ages',
        'public' => true,
        'menu_position' => 22,
        'menu_icon' => 'dashicons-groups'
      )
    );
  }

  function create_taxonomies() {
    register_taxonomy(
      'borough',
      'tribe_events',
      array(
        'label' => __( 'Boroughs' ),
        'hierarchical' => true
      )
    );

    register_taxonomy(
      'age_group',
      array('age', 'tribe_events', 'program'),
      array(
        'label' => __( 'Age Groups' ),
        'rewrite' => array(
          'slug' => 'age-group',
          'with_front' => false
        ),
        'hierarchical' => true
      )
    );

    register_taxonomy(
      'programs_cat',
      'program',
      array(
        'label' => __( 'Program Categories' ),
        'hierarchical' => true
      )
    );
  }

  function populate_taxonomies() {
    if ( !term_exists( 'The Bronx', 'borough' ) ) {
      wp_insert_term(
        'The Bronx',
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

    $age_groups = array( 'Baby', 'Toddler', 'Pre-Schooler', 'Grade Schooler' );
    foreach( $age_groups as $age_group ) {
      if ( !term_exists( $age_group, 'age_group' ) ) {
        wp_insert_term( $age_group, 'age_group' );
      }
    }
  }
}
new GUPostTypes();
