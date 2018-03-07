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
$context['title'] = SummerGuides\get_title();
$context['tagline'] = SummerGuides\get_tagline();
$context['filtered'] = SummerGuides\is_filtered();
$context['taxonomies'] = SummerGuides\get_taxonomies();
$context['banner'] = SummerGuides\get_hero_banner_img();
$context['filters'] = SummerGuides\get_filters();
$context['domain'] = SummerGuides\get_translation_domain();
$context['archive_link'] = SummerGuides\get_archive_link();
$context['pagination'] = SummerGuides\get_pagination();

Timber::render(array('filter-summer-guide.twig'), $context);
