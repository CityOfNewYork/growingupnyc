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

$context['taxonomies'] = SummerGuides\get_taxonomies();
$context['sections'] = Templating\get_sections();
$context['archive_link'] = SummerGuides\get_archive_link();

Timber::render(array('single-summer-guide.twig'), $context);
