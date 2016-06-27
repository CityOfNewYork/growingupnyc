<?php

if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}
$context = Timber::get_context();
$context['posts'] = Timber::get_posts(false, 'GunyEvent');
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