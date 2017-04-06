<?php

if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}

$context = Timber::get_context();

// Get current filter selections
$cat_id = get_query_var('cat_id');
$age_id = get_query_var('age_id');
$borough_id = get_query_var('borough_id');

$today = date_i18n( Tribe__Date_Utils::DBDATEFORMAT, strtotime( date( 'Y-m-d', current_time( 'timestamp' ) ) ) );
$current_month_date = tribe_get_month_view_date();

if ( $today < $current_month_date ) {
  $context['prev_month_url'] = tribe_get_previous_month_link();
}
$context['next_month_url'] = tribe_get_next_month_link();
$context['current_month_text'] = date( 'F Y', strtotime( $current_month_date ) );

// Group current view's events by day
while ( tribe_events_have_month_days() ) : tribe_events_the_month_day();
  $day = tribe_events_get_current_month_day();
  if ($day['date'] >= $today) {
    if(!empty($day['events']->posts) && $day['month'] == 0) {
      // Empty array
      $event_posts = array();

      foreach ($day['events']->posts as $post) {
        $event_posts[] = new GunyEvent($post);
      }

      if(count($event_posts) > 0) {
        $context['event_list'][] = array(
          'date_header' => date( 'l, F j', strtotime( $day['date'] ) ),
          'posts' => $event_posts
        );
      }
    }
  }
endwhile;

// Filter parameters and values
if ($_SERVER['QUERY_STRING']) {
  $query_string = '?' . $_SERVER['QUERY_STRING'];
} else {
  $query_string = '';
}

// Event Category Filter
$event_filter = Timber::get_terms('tribe_events_cat', array(
  'orderby' => 'NAME',
  'hide_empty' => true,
  'depth' => 1,
  'hierarchical' => true,
) );
foreach ($event_filter as $key => $value) {
  $value->link = add_query_arg( 'cat_id', $value->ID );
  $event_filter[$key] = $value;
}
$context['event_filter'] = $event_filter;
$context['all_events'] = array(
  'name' => 'All Event Types',
  'link' => remove_query_arg( 'cat_id' )
);
if ( $cat_id > 0 ) {
  $context['current_event_filter'] = Timber::get_term( $cat_id )->name;
} else {
  $context['current_event_filter'] = $context['all_events']['name'];
}

// Age Group Filter
$age_filter = Timber::get_terms('age_group', array(
  'hierarchical' => true,
  'depth' => 1,
  'hide_empty' => true,
  'orderby' => 'term_order'
) );
foreach ($age_filter as $key => $value) {
  $value->link = add_query_arg( 'age_id', $value->ID );
  $event_filter[$key] = $value;
}
$context['age_filter'] = $age_filter;
$context['all_ages'] = array(
  'name' => 'All Ages',
  'link' => remove_query_arg( 'age_id' )
);
if ( $age_id > 0 ) {
  $context['current_age_filter'] = Timber::get_term( $age_id )->name;
} else {
  $context['current_age_filter'] = $context['all_ages']['name'];
}

// Borough Filter
$borough_filter = Timber::get_terms('borough', array(
  'hierarchical' => true,
  'depth' => 1,
  'orderby' => 'NAME',
  'hide_empty' => true
) );
foreach ($borough_filter as $key => $value) {
  $value->link = add_query_arg( 'borough_id', $value->ID );
  $event_filter[$key] = $value;
}
$context['borough_filter'] = $borough_filter;
$context['all_boroughs'] = array(
  'name' => 'All Boroughs',
  'link' => remove_query_arg( 'borough_id' )
);
if ( $borough_id > 0 ) {
  $context['current_borough_filter'] = Timber::get_term( $borough_id )->name;
} else {
  $context['current_borough_filter'] = $context['all_boroughs']['name'];
}

$templates = array( 'list-events.twig', 'index.twig' );

Timber::render( $templates, $context );
