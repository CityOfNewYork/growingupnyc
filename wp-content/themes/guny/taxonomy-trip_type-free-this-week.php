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
$context['posts'] = facetwp_display('template', 'free_this_week');
$context['facet_trip'] = facetwp_display( 'facet', 'trip_free_this_week' );
$templates = array( 'list-trip.twig', 'microsite-list.twig' );
Timber::render( $templates, $context );