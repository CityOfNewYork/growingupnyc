<?php

/*
Template Name: Generic Microsite Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

// determines if there is an embed
if (strpos($post->post_content, 'script')) {
  $context['has_embed'] = true;
}

$context['post'] = $post;
$context['sections'] = Templating\get_sections();

$templates = array( 'generic-microsite-page.twig' );
Timber::render( $templates, $context );