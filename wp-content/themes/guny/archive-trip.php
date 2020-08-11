<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/
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


$template = 'trip/landing.twig';

// meta tags
$context['meta_desc'] = get_field('trip_landing_meta_desc', 'option');
$context['meta_keywords'] = get_field('trip_landing_meta_keywords', 'option');

Timber::render( $template, $context );