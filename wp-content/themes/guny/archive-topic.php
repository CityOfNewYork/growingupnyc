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
$context['topic_menu'] = Timber::get_terms('topic_group', array(
  'orderby' => 'term_order',
  'hide_empty' => false,
));
$templates = array( 'list-topic.twig', 'microsite-list.twig' );
Timber::render( $templates, $context );