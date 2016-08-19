<?php

/**
* Add additional query variables
*/
function guny_add_query_vars( $vars ) {
  $vars[] = 'cat_id';
  $vars[] = 'age_id';
  $vars[] = 'borough_id';
  return $vars;
}
add_filter( 'query_vars', 'guny_add_query_vars' );

/**
* Intercept the Events Calendar query and add params
* @param {WP_Query} $query - Original query object
*/
function guny_events_get_posts( $query ) {
  if ( $query->tribe_is_event_query && $query->get( 'eventDisplay' ) === 'month' ) {
    $cat_id = $query->get( 'cat_id' );
    $age_id = $query->get( 'age_id' );
    $borough_id = $query->get( 'borough_id' );
    $tax_query = array(
      'relation' => 'AND'
    );
    if ( $cat_id > 0 ) {
      $tax_query[] = array(
        'taxonomy' => 'tribe_events_cat',
        'field' => 'term_id',
        'terms' => $cat_id
      );
    }
    if ( $age_id > 0 ) {
      $tax_query[] = array(
        'taxonomy' => 'age_group',
        'field' => 'term_id',
        'terms' => $age_id
      );
    }
    if ( $borough_id > 0 ) {
      $tax_query[] = array(
        'taxonomy' => 'borough',
        'field' => 'term_id',
        'terms' => $borough_id
      );
    }
    $query->set( 'tax_query', $tax_query );
  }
}
add_action( 'pre_get_posts', 'guny_events_get_posts', 50 );
