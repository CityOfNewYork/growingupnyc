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

// Check the language
// Global constants are not good practice...
// ... disabling error messages isn't debug friendly...
// ... disable error reporting for this line only.
error_reporting(0);
$context['language'] = ICL_LANGUAGE_CODE;
error_reporting(WP_DEBUG);
$templates = array( 'home.twig' );

Timber::render( $templates, $context );