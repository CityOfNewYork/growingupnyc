<?php
/**
* Front Page
*/
$context = Timber::get_context();
$context['post'] = Timber::get_post();

// meta tags
$context['meta_desc'] = $post->meta_description;
$context['meta_keywords'] = $post->meta_keywords;
$context['meta_noindex'] = $post->meta_noindex;

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