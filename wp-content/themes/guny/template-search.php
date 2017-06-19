<?php
/*
Template Name: Search Results
*/

if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}
$context = Timber::get_context();
$context['results'] = facetwp_display('template', 'default');
$context['search'] = facetwp_display('facet', 'search');
$context['facet_post_type'] = facetwp_display( 'facet', 'post_type' );
$context['pagination'] = facetwp_display('pager');
//$context['did_you_mean'] = relevanssi_didyoumean(get_search_query(), '', '');
$templates = array( 'search.twig', 'index.twig' );


print_r(facetwp_display('template', 'default'));
Timber::render( $templates, $context );
