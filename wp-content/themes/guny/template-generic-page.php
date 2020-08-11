<?php
/*
Template Name: Generic Page
*/

$context = Timber::get_context();
$post = Timber::get_post();

// meta tags
$context['meta_desc'] = $post->meta_description;
$context['meta_keywords'] = $post->meta_keywords;

$templates = array('generic-page.twig');

$context['post'] = $post;
$context['sections'] = Templating\get_sections();

// WPML language switcher
$is_translated = apply_filters( 'wpml_element_has_translations', NULL, $post->id, 'page' );
if ($is_translated) {
  $context['top_widget'] = Timber::get_widgets('top_widget');
}

Timber::render($templates, $context);