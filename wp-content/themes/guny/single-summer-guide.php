<?php

/**
 * Summer Guides Post Type
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;
// pre_dump($post);

$context['top_widget'] = Timber::get_widgets('top_widget');

$context['archive_link'] = get_post_type_archive_link('summer-guide');
$context['domain'] = 'GUNY-Seasonal';
$context['eventslink'] = get_post_type_archive_link('tribe_events');

// in-body alert under banner
$landing_page = get_page_by_path('summer');
$context['program_page_alert'] = get_field('banner_content', get_field('banner_alert_message', $landing_page->ID));

$template = 'summer-guide/single.twig';

Timber::render($template, $context);
