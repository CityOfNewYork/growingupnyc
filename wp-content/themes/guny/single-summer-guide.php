<?php

/**
 * Summer Guides Post Type
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

$context['custom_switcher'] = Timber::compile(
  array('partials/language-switcher.twig'),
  array(
    'languages' => Wpml\get_wpdb_languages(),
    'current' => ICL_LANGUAGE_CODE
  )
);

$templates = array('single-' . $post->post_type . '.twig');

Timber::render($templates, $context);