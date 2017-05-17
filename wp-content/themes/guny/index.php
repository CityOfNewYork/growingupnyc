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
$context['posts'] = Timber::get_posts();
$templates = array( 'list.twig' );
echo "inside index.php";
if ( count( $context['posts'] ) > 0 ) {
  $post_type = $context['posts'][0]->post_type;
  array_unshift( $templates, "list-$post_type.twig" );
}

Timber::render( $templates, $context );