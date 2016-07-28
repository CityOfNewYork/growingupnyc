<?php

if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}
$context = Timber::get_context();

while ( tribe_events_have_month_days() ) : tribe_events_the_month_day();
  $day = tribe_events_get_current_month_day();

  if(!empty($day['events']->posts) && $day['month'] == 0) {

    // Empty array
    $event_posts = array();

    foreach ($day['events']->posts as $post) {
      $event_posts[] = new GunyEvent($post);
    }

    $context['event_list'][] = array(
      'date_header' => date('l, F j', strtotime($day['date'])),
      'posts' => $event_posts
    );
  }
endwhile;

$context['post_filters'] = tribe_events_get_filters();

$post_views = tribe_events_get_views();

foreach ($post_views as $key => $view) {
  $view['selected'] = tribe_is_view($view['displaying']);
  $post_views[$key] = $view;
}

$context['post_views'] = $post_views;

$context['current_url'] = tribe_events_get_current_filter_url();

$templates = array( 'list-events.twig', 'index.twig' );

Timber::render( $templates, $context );