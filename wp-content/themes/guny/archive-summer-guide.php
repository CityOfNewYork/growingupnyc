<?php

/**
 * Archive for Summer Guides (landing page, list view)
 */

$context = Timber::get_context();

$context['custom_switcher'] = Timber::compile(
  array('partials/language-switcher.twig'),
  array(
    'languages' => Wpml\get_wpdb_languages(),
    'current' => ICL_LANGUAGE_CODE
  )
);

$context['posts'] = Timber::get_posts();
$context['taxonomies'] = SummerGuides\get_taxonomies();
$context['banner'] = SummerGuides\get_hero_banner_img();
$context['filters'] = SummerGuides\get_filters();
$context['domain'] = SummerGuides\get_translation_domain();
$context['archive_link'] = SummerGuides\get_archive_link();

Timber::render(array('list-summer-guide.twig'), $context);