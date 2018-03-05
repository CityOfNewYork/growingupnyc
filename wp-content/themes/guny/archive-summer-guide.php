<?php

/**
 * Archive for Summer Guides (landing page, list view)
 */

$context = Timber::get_context();

/** Filter IDs are translated to English until this post type is translated. */
$context['translated_ids'] = true;

$context['custom_switcher'] = Timber::compile(
  array('partials/language-switcher.twig'),
  array(
    'languages' => Wpml\get_wpdb_languages(),
    'current' => ICL_LANGUAGE_CODE
  )
);

$context['taxonomies'] = SummerGuides\get_taxonomies();
$context['banner'] = SummerGuides\get_hero_banner_img();
$context['filters'] = SummerGuides\get_filters($context['translated_ids']);
$context['domain'] = SummerGuides\get_translation_domain();

Timber::render(array('list-summer-guide.twig'), $context);