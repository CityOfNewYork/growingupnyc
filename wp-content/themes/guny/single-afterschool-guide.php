<?php

/**
 * Summer Guides Post Type
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

$context['taxonomies'] = AfterschoolGuides\get_taxonomies();
$context['sections'] = Templating\get_sections();
$context['archive_link'] = AfterschoolGuides\get_archive_link();
$context['domain'] = AfterschoolGuides\get_translation_domain();
$context['events_link'] = get_post_type_archive_link('tribe_events');

Timber::render(array('single-afterschool-guide.twig'), $context);
