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
$context['facet_becoming_an_adult'] = facetwp_display( 'facet', 'becoming_an_adult' );
$context['facet_counseling'] = facetwp_display( 'facet', 'counseling' );
$context['facet_going_to_school'] = facetwp_display( 'facet', 'going_to_school' );
$context['facet_staying_healthy'] = facetwp_display( 'facet', 'staying_healthy' );
$context['facet_working'] = facetwp_display( 'facet', 'working' );
$context['facet_budget_finance'] = facetwp_display( 'facet', 'budget_finance' );
$templates = array( 'list-topic.twig', 'microsite-list.twig' );
Timber::render( $templates, $context );