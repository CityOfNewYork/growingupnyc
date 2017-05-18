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
$context['posts'] = facetwp_display('template', 'topics');
$context['pagination'] = facetwp_display('pager');
$context['facet_topic_type'] = facetwp_display( 'facet', 'topic_type' );
$context['facet_ages'] = facetwp_display( 'facet', 'ages' );
$templates = array( 'list-topic.twig', 'microsite-list.twig' );
Timber::render( $templates, $context );