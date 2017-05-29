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
// $context['posts'] = facetwp_display('template', 'trips');
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
$upcoming_events = GunySite::get_featured_events( 3, null , true );
$context['upcoming_events'] = $upcoming_events;

$templates = array( 'list-trip-landing.twig', 'microsite-list.twig' );

Timber::render( $templates, $context );