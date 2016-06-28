<?php
/**
* Plugin Name: Growing Up NYC Post Types
* Description: Custom post types and taxonomies
* Version: 1.0.0
* Author: Blue State Digital <http://www.bluestatedigital.com>
*/

class GUPostTypes {

  function __construct() {
    register_activation_hook( __FILE__, array( $this, 'activate' ) );
    add_action( 'init', array( $this, 'create_taxonomies' ) );
  }

  function activate() {
    $this->create_taxonomies();
    $this->populate_taxonomies();
  }

  function create_taxonomies() {
    register_taxonomy(
      'borough',
      'tribe_events',
      array(
        'label' => __( 'Boroughs' ),
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
  }
}

new GUPostTypes();
