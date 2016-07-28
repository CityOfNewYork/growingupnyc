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

$tribe_ecp = Tribe__Events__Main::instance();
$context['prev_month_url'] = $tribe_ecp->getLink( 'month', $tribe_ecp->previousMonth( tribe_get_month_view_date() ), null );
$context['next_month_url'] = $tribe_ecp->getLink( 'month', $tribe_ecp->nextMonth( tribe_get_month_view_date() ), null );
$context['current_month_text'] = date('F', strtotime( tribe_get_month_view_date() ));

$templates = array( 'list-events.twig', 'index.twig' );

Timber::render( $templates, $context );