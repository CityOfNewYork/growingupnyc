<?php
/**
* Front Page
*/
if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}
$context = Timber::get_context();

if (function_exists('tribe_get_events')) {
  $events = tribe_get_events( array(
    'orderby' => 'menu_order',
    'posts_per_page' => 4
  ) );
  foreach($events as $i => $event) {
    $events[$i] = new GunyEvent($event);
  }
  $context['events'] = $events;
}

$templates = array( 'home.twig' );

Timber::render( $templates, $context );