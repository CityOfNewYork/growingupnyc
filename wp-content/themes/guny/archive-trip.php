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
$context['posts'] = facetwp_display('template', 'trips');
$context['pagination'] = facetwp_display('pager');
$context['facet_program_type'] = facetwp_display( 'facet', 'trip_type' );
$context['facet_ages'] = facetwp_display( 'facet', 'ages' );
$templates = array( 'list-trip.twig', 'microsite-list.twig' );
// echo "SALOG : archieve trip php";
Timber::render( $templates, $context );
// print_r($context['posts']);