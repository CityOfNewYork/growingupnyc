<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/
if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}

$context = Timber::get_context();
//Freethis week trips
$free_this_week_trip = array(
'post_type' => 'trip',
'posts_per_page' => 3,
'tax_query' => array(
  array(
    'taxonomy' => 'trip_type',
    'field' => 'slug',
    'terms' => 'free-this-week',
  ),
),
'orderby' => array(
    'date' => 'DESC'
));
$context['free_this_week_trip'] = Timber::get_posts( $free_this_week_trip );

//Free day trips
$free_day_trip = array(
'post_type' => 'trip',
'posts_per_page' => 3,
'tax_query' => array(
  array(
    'taxonomy' => 'trip_type',
    'field' => 'slug',
    'terms' => 'free-day-trip',
  ),
),
'orderby' => array(
    'date' => 'DESC'
));
$context['free_day_trip'] = Timber::get_posts( $free_day_trip );

//Events
$taxquery = array(
   array(
    'taxonomy' => 'age_group',
    'field' => 'slug',
    'terms' => array('teen' , 'young-adult'),
  )
);
$upcoming_events = GunySite::get_featured_events( 3 , $taxquery , true );
$context['upcoming_events'] = $upcoming_events;

// $upcoming_events = array(
//   'post_type' => 'tribe_events',
//   'posts_per_page' => 1,
//   'tax_query' => array(
//     array(
//       'taxonomy' => 'age_group',
//       'field' => 'slug',
//       'terms' => array('teen' , 'young-adult'),
//     ),
//   ),
// );
// $context['upcoming_events'] = Timber::get_posts( $upcoming_events ) ;


$templates = array( 'list-trip-landing.twig', 'microsite-list.twig' );

Timber::render( $templates, $context );