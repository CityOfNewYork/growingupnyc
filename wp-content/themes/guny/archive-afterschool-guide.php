<?php

/**
 * Archive for After School Guide (landing page, list view)
 */

$context = Timber::get_context();

$context['posts'] = Timber::get_posts();
$context['page_title'] = AfterschoolGuides\get_title();
$context['page_tagline'] = AfterschoolGuides\get_tagline();
$context['filtered'] = AfterschoolGuides\is_filtered();
$context['taxonomies'] = AfterschoolGuides\get_taxonomies();
$context['banner'] = AfterschoolGuides\get_hero_banner_img();
$context['filters'] = AfterschoolGuides\get_filters();
$context['domain'] = AfterschoolGuides\get_translation_domain();
$context['archive_link'] = AfterschoolGuides\get_archive_link();
$context['reset_link'] = AfterschoolGuides\get_reset_link();
$context['pagination'] = AfterschoolGuides\get_pagination();

Timber::render(array('filter-afterschool-guide.twig'), $context);