<?php

if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}

$context = Timber::get_context();

// Group current view's events by day
while ( tribe_events_have_month_days() ) : tribe_events_the_month_day();
  $day = tribe_events_get_current_month_day();

  if(!empty($day['events']->posts) && $day['month'] == 0) {
    // Empty array
    $event_posts = array();

    foreach ($day['events']->posts as $post) {
      $passed_filtering = true;

      if(get_query_var('cat_id') > 0) {
        if(!has_term( get_query_var('cat_id'), 'tribe_events_cat', $post->ID)) {
          $passed_filtering = false;
        }
      }
      if(get_query_var('age_id') > 0) {
        if(!has_term( get_query_var('age_id'), 'age_group', $post->ID)) {
          $passed_filtering = false;
        }
      }
      if(get_query_var('borough_id') > 0) {
        if(!has_term( get_query_var('borough_id'), 'borough', $post->ID)) {
          $passed_filtering = false;
        }
      }

      if($passed_filtering) {
        $event_posts[] = new GunyEvent($post);
      }

    }

    if(count($event_posts) > 0) {
      $context['event_list'][] = array(
        'date_header' => date('l, F j', strtotime($day['date'])),
        'posts' => $event_posts
      );
    }
  }
endwhile;

// Filter parameters and values
if ($_SERVER['QUERY_STRING']) {
  $query_string = '?' . $_SERVER['QUERY_STRING'];
} else {
  $query_string = '';
}

// Month pager variables
$tribe_ecp = Tribe__Events__Main::instance();
$context['prev_month_url'] = $tribe_ecp->getLink( 'month', $tribe_ecp->previousMonth( tribe_get_month_view_date() ), null ) . $query_string;
$context['next_month_url'] = $tribe_ecp->getLink( 'month', $tribe_ecp->nextMonth( tribe_get_month_view_date() ), null ) . $query_string;
$context['current_month_text'] = date('F', strtotime( tribe_get_month_view_date() ));

// Filters
$context['event_filter'] = TimberHelper::function_wrapper(
  'wp_dropdown_categories',
  array(
    array (
      'show_option_all' => 'All Events',
      'taxonomy' => 'tribe_events_cat',
      'hierarchical' => true,
      'depth' => 1,
      'selected' => get_query_var( 'cat_id' ),
      'name' => 'cat_id',
      'class' => 'c-list-box__heading',
      'echo' => 0,
      'orderby' => 'NAME',
      'hide_empty' => 0
    )
  )
);
$context['age_filter'] = TimberHelper::function_wrapper(
  'wp_dropdown_categories',
  array(
    array (
      'show_option_all' => 'All Ages',
      'taxonomy' => 'age_group',
      'hierarchical' => true,
      'depth' => 1,
      'selected' => get_query_var( 'age_id' ),
      'name' => 'age_id',
      'class' => 'c-list-box__heading',
      'echo' => 0,
      'hide_empty' => 0
    )
  )
);
$context['borough_filter'] = TimberHelper::function_wrapper(
  'wp_dropdown_categories',
  array(
    array (
      'show_option_all' => 'All Boroughs',
      'taxonomy' => 'borough',
      'hierarchical' => true,
      'depth' => 1,
      'selected' => get_query_var( 'borough_id' ),
      'name' => 'borough_id',
      'class' => 'c-list-box__heading',
      'echo' => 0,
      'orderby' => 'NAME',
      'hide_empty' => 0
    )
  )
);

$templates = array( 'list-events.twig', 'index.twig' );

Timber::render( $templates, $context );