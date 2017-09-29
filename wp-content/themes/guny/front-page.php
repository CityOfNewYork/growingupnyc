<?php
/**
* Front Page
*/
if ( ! class_exists( 'Timber' ) ) {
  echo 'Timber not activated. Make sure you activate the plugin in <a href="/wp-admin/plugins.php#timber">/wp-admin/plugins.php</a>';
  return;
}
$context = Timber::get_context();
$context['post'] = Timber::get_post();

$featured_image = get_the_post_thumbnail_url($post);
$context['featured_image'] = $featured_image;

$context['language'] = ICL_LANGUAGE_CODE;
$templates = array( 'home.twig' );

Timber::render( $templates, $context );