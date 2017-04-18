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

$templates = array( 'home.twig' );

$context['top_widgets'] = Timber::get_widgets('top_widget');

Timber::render( $templates, $context );