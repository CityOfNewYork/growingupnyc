<?php
/**
* Functions to autopopulate the Age Groups taxonomy with Age post entries
*/

/**
* Create a new Age Group term whenever an Age post type is created
*/
function guny_autopopulate_age_groups( $post_id, $post, $update ) {
  if ( $post->post_status !== 'publish' || wp_is_post_revision( $post_id ) ) {
    return;
  }

  // Get the age group this age should fall under
  $parent_term = 0;
  // Get the term using the normal Wordpress taxonomy terms
  if ( !empty( $_REQUEST['tax_input'] ) && !empty( $_REQUEST['tax_input']['age_group'] ) ) {
    foreach( $_REQUEST['age_group'] as $age ) {
      $parent_term = $age;
    }
  // If there are no taxonomy terms, try the ACF custom field
  } elseif( !empty( $_REQUEST['acf'] ) ) {
    $acf_field_key = 'field_5774006acfd1f';
    if ( !empty( $_REQUEST['acf'][$acf_field_key] ) ) {
      $parent_term = $_REQUEST['acf'][$acf_field_key];
    }
  }

  // Get the term slug (which will be the post ID)
  $slug = $post_id;

  if ( $update ) {
    $existing_term = get_term_by( 'slug', $slug, 'age_group' );

    if ( $existing_term ) {
      // Does it need to be updated?
      if ( $existing_term->name !== $post->post_title ||
        ( (int) $existing_term->parent !== (int) $parent_term && $existing_term->term_id !== (int) $parent_term )
      ) {
        // If so, update it
        wp_update_term( $existing_term->term_id, 'age_group', array(
          'name' => $post->post_title,
          'parent' => (int) $parent_term
        ) );
      }
      return;
    }
  }

  // No term exists yet, so let's create one
  wp_insert_term( $post->post_title, 'age_group', array('slug' => $slug, 'parent' => $parent_term ) );
}
add_action( 'save_post_age', 'guny_autopopulate_age_groups',  10, 3 );

/**
* Remove default Age Groups taxonomy box from Ages
*/
function guny_remove_meta() {
  remove_meta_box( 'age_groupdiv', 'age', 'side' );
}
add_action( 'admin_menu', 'guny_remove_meta' );

/**
* Filter the available terms on the Ages edit page
*/
function guny_filter_available_age_groups( $args ) {
  $args['parent'] = 0;
  return $args;
}
add_action( 'acf/fields/taxonomy/query/key=field_5774006acfd1f', 'guny_filter_available_age_groups' );