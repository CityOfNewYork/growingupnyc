<?php

/**
 * Summer Guides Post Type
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

$context['taxonomies'] = SummerGuides\get_taxonomies();
$context['sections'] = Templating\get_sections();
$context['archive_link'] = SummerGuides\get_archive_link();

Timber::render(array('single-summer-guide.twig'), $context);
