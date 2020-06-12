<?php

/**
 * Summer Guides Post Type
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;

$context['sections'] = Templating\get_sections();

// in-body alert under banner
$landing_page = get_page_by_path('summer');
$context['program_page_alert'] = get_field('banner_content', get_field('banner_alert_message', $landing_page->ID));

Timber::render(array('single-summer-guide.twig'), $context);
