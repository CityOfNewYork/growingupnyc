<?php

/**
 * Archive for Summer Guides (landing page, list view)
 */

$context = Timber::get_context();

// pre_dump($context['request']->get);

$context['posts'] = Timber::get_posts();
$context['page_title'] = SummerGuides\get_title();
$context['page_tagline'] = SummerGuides\get_tagline();
$context['filtered'] = SummerGuides\is_filtered();
$context['taxonomies'] = SummerGuides\get_taxonomies();
$context['banner'] = SummerGuides\get_hero_banner_img();
$context['filters'] = SummerGuides\get_filters();
$context['domain'] = SummerGuides\get_translation_domain();
$context['archive_link'] = SummerGuides\get_archive_link();
$context['reset_link'] = SummerGuides\get_reset_link();
$context['pagination'] = SummerGuides\get_pagination();

Timber::render(array('filter-summer-guide.twig'), $context);
