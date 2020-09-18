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
        'menu_position' => 21,
        'menu_icon' => 'dashicons-megaphone',
        'supports' => array( 'title' ),
        'has_archive' => false,
        'rewrite' => false
      )
    );

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
        'menu_position' => 22,
        'menu_icon' => get_template_directory_uri().'/assets/img/gunyc-admin-icon.png',
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
          'name' => 'Age Guides',
          'singular_name' => 'Age Guide',
          'add_new_item' => 'Add New Age Guide',
          'edit_item' => 'Edit Age Guide',
          'new_item' => 'New Age Guide',
          'view_item' => 'View Age Guide',
          'search_items' => 'Search Age Guides',
          'not_found' => 'No ages found',
          'not_found_in_trash' => 'No ages found in trash',
          'all_items' => 'All Ages',
          'archives' => 'Age Guide Archives',
          'insert_into_item' => 'Insert into age',
          'uploaded_to_this_item' => 'Uploaded to this age'
        ),
        'public' => true,
        'menu_position' => 23,
        'menu_icon' => get_template_directory_uri().'/assets/img/gunyc-admin-icon.png',
        'supports' => array( 'title', 'excerpt' ),
        'has_archive' => false,
        'rewrite' => array(
          'slug' => 'age',
          'with_front' => false
        )
      )
    );

    register_post_type(
      'summer-guide',
      array(
        'labels' => array(
          'name' => 'Summer Guide',
          'singular_name' => 'Summer Guide',
          'add_new_item' => 'Add New Summer Guide',
          'edit_item' => 'Edit Summer Guide',
          'new_item' => 'New Summer Guide',
          'view_item' => 'View Summer Guide',
          'search_items' => 'Search Summer Guide',
          'not_found' =>  'No Summer Guide Found',
          'not_found_in_trash' => 'No Summer Guide found in trash',
          'all_items' => 'All Activities',
          'archives' => 'Summer Guide Archives',
          'insert_into_item' => 'Insert into Summer Guide',
          'uploaded_to_this_item' => 'Uploaded to this Summer Guide'
        ),
        'public' => true,
        'menu_position' => 24,
        'menu_icon' => get_template_directory_uri().'/assets/img/gunyc-admin-icon.png',
        'show_in_rest' => true,
        'supports' => array('title', 'excerpt', 'editor'),
        'has_archive' => true,
        'rewrite' => array(
          'slug' => 'summer-programs',
          'with_front' => false
        )
      )
    );

    register_post_type(
      'afterschool-guide',
      array(
        'labels' => array(
          'name' => 'After School Guide',
          'singular_name' => 'After School Guide',
          'add_new_item' => 'Add New After School Guide',
          'edit_item' => 'Edit After School Guide',
          'new_item' => 'New After School Guide',
          'view_item' => 'View After School Guide',
          'search_items' => 'Search After School Guide',
          'not_found' =>  'No After School Guide Found',
          'not_found_in_trash' => 'No After School Guide found in trash',
          'all_items' => 'All Activities',
          'archives' => 'After School Guide Archives',
          'insert_into_item' => 'Insert into After School Guide',
          'uploaded_to_this_item' => 'Uploaded to this After School Guide'
        ),
        'public' => true,
        'menu_position' => 25,
        'menu_icon' => get_template_directory_uri().'/assets/img/gunyc-admin-icon.png',
        'show_in_rest' => true,
        'supports' => array('title', 'excerpt', 'editor'),
        'has_archive' => true,
        'rewrite' => array(
          'slug' => 'after-school-programs',
          'with_front' => false
        )
      )
    );

    register_post_type(
      'brain-building-tip',
      array(
        'labels' => array(
          'name' => 'Brain Building Tips',
          'singular_name' => 'Brain Building Tip',
          'add_new_item' => 'Add New Brain Building Tip',
          'edit_item' => 'Edit Brain Building Tip',
          'new_item' => 'New Brain Building Tip',
          'view_item' => 'View Brain Building Tip',
          'search_items' => 'Search Brain Building Tip',
          'not_found' =>  'No Brain Building Tip Found',
          'not_found_in_trash' => 'No Brain Building Tip found in trash',
          'all_items' => 'All Brain Building Tips',
          'archives' => 'Brain Building Tip Archives',
          'insert_into_item' => 'Insert into Brain Building Tip',
          'uploaded_to_this_item' => 'Uploaded to this Brain Building Tip'
        ),
        'public' => true,
        'menu_position' => 26,
        'menu_icon' => get_template_directory_uri().'/assets/img/gunyc-admin-icon.png',
        'show_in_rest' => true,
        'supports' => array('title', 'excerpt'),
        'has_archive' => true,
        'rewrite' => array(
          'slug' => 'brainbuilding',
          'with_front' => false
        )
      )
    );
  }

  /* Creates the taxonomies - will use value entered in custom fields in GUNY Settings, otherwise will default */
  function create_taxonomies() {
    register_taxonomy(
      'borough',
      array('tribe_events', 'summer-guide', 'afterschool-guide'),
      array(
        'label' => (check_taxonomy('field_5ddd46a7bccbe') !='' ? 
            __(get_field('field_5ddd46a7bccbe', 'option')) : __( 'Event Location' )),
        'hierarchical' => true,
        'rewrite' => false,
        'show_in_rest' => true
      )
    );

    register_taxonomy(
      'age_group',
      array('age', 'tribe_events', 'program', 'summer-guide', 'afterschool-guide', 'brain-building-tip'),
      array(
        'label' => (check_taxonomy('field_5ddd45a1bccba') !='' ? 
            __(get_field('field_5ddd45a1bccba', 'option')) : __( 'Age Groups' )),
        'hierarchical' => true,
        'rewrite' => false,
        'show_in_rest' => true
      )
    );

    register_taxonomy(
      'programs_cat',
      array('program'),
      array(
        'label' => (check_taxonomy('field_5ddd45d8bccbb') !='' ? 
            __(get_field('field_5ddd45d8bccbb', 'option')) : __( 'Program Categories' )),
        'hierarchical' => true,
        'show_in_rest' => true
      )
    );

    register_taxonomy(
      'summer_programs_cat',
      array('summer-guide'),
      array(
        'label' => (check_taxonomy('field_5ddd4606bccbc') !='' ? 
                    __(get_field('field_5ddd4606bccbc', 'option')) : __( 'Interests' )),
        'hierarchical' => true,
        'rewrite' => false,
        'show_in_rest' => true,
      )
    );

    register_taxonomy(
      'afterschool_programs_cat',
      array('afterschool-guide'),
      array(
        'label' => (check_taxonomy('field_5ddd4440bccb9') !='' ? 
                    __(get_field('field_5ddd4440bccb9', 'option')) : __( 'Activity Categories' )),
        'hierarchical' => true,
        'rewrite' => false,
        'show_in_rest' => true
      )
    );

    register_taxonomy(
      'activity_type',
      array('summer-guide'),
      array(
        'label' => (check_taxonomy('field_5ddd463dbccbd') !='' ? 
            __(get_field('field_5ddd463dbccbd', 'option')) : __( 'Activity Type' )),
        'hierarchical' => true,
        'rewrite' => false,
        'show_in_rest' => true
      )
    );
    
    register_taxonomy(
      'tip_category',
      array('brain-building-tip'),
      array(
        'label' => (check_taxonomy('field_5df8f05f88771') !='' ? 
            __(get_field('field_5df8f05f88771', 'option')) : __( 'Tip Category' )),
        'hierarchical' => true,
        'rewrite' => false,
        'show_in_rest' => true
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

// Gets the custom field value is set in GUNY Settings
function check_taxonomy($field) {
  $val = '';
  if (function_exists('acf_get_field')) {
    $val = get_field($field, 'option');
  }
  return $val;
}
new GUPostTypes();
