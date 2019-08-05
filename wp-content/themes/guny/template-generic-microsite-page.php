<?php

/*
Template Name: Generic Microsite Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

// determines if there is an embed
if (strpos($post->post_content, 'script')) {
  $context['loading'] = true;
}

$templates = array( 'generic-microsite-page.twig' );

$context['post'] = $post;
$context['sections'] = Templating\get_sections();

Timber::render( $templates, $context );