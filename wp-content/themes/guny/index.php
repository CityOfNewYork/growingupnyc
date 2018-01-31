<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/
$context = Timber::get_context();
$context['posts'] = Timber::get_posts();
$templates = array( 'list.twig' );
if ( count( $context['posts'] ) > 0 ) {
  $post_type = $context['posts'][0]->post_type;
  array_unshift( $templates, "list-$post_type.twig" );
}

Timber::render( $templates, $context );