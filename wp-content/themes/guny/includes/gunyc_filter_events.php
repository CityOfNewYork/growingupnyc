<?php

/**
* Add additional query variables
*/
function guny_add_query_vars( $vars ) {
  $vars[] = 'cat_id';
  $vars[] = 'age_id';
  $vars[] = 'borough_id';
  // $vars[] = 'lang_id';
  return $vars;
}
add_filter( 'query_vars', 'guny_add_query_vars' );

/**
* Intercept the Events Calendar query and add params
* @param {WP_Query} $query - Original query object
*/
function guny_events_get_posts( $query ) {
  if ( $query->is_main_query() && $query->tribe_is_event_query &&
    ( $query->get( 'eventDisplay' ) == 'month'
      || $query->get( 'eventDisplay' ) == 'list' )
  ) {
    $cat_id = $query->get( 'cat_id' );
    $age_id = $query->get( 'age_id' );
    $borough_id = $query->get( 'borough_id' );
    // $lang_id = $query->get( 'lang_id' );
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
    // if ( $lang_id > 0 ) {
    //   $tax_query[] = array(
    //     'taxonomy' => 'language',
    //     'field' => 'term_id',
    //     'terms' => $lang_id
    //   );
    // }
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

    $today = tribe_beginning_of_day( date_i18n( Tribe__Date_Utils::DBDATETIMEFORMAT ) );
    if ( $query->get( 'start_date') < $today ) {
      $query->set( 'start_date', $today );
    }
    $end_date = new DateTime( $query->get( 'start_date' ) );
    $end_date = new DateTime( $end_date->format('Y-m-t') );
    $query->set( 'end_date', tribe_end_of_day( $end_date->format( Tribe__Date_Utils::DBDATETIMEFORMAT ) ) );
  }
}
add_action( 'pre_get_posts', 'guny_events_get_posts', 60 );

// Use the release, rather than experimental, version of Google Maps API
// for event pages
function guny_google_maps_api( $url ) {
  return add_query_arg( 'v', 3, $url );
}
add_filter( 'tribe_events_google_maps_api', 'guny_google_maps_api' );
