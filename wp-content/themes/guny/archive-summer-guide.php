<?php

/**
 * Archive for Summer Guides (landing page, list view)
 */

$context = Timber::get_context();

$context['page_title'] = SummerGuides\get_title();
$context['page_tagline'] = SummerGuides\get_tagline();
$context['banner'] = SummerGuides\get_hero_banner_img();
$context['filters'] = SummerGuides\get_filters();
$context['post_type'] = 'summer-guide';
$context['programs_alert'] = SummerGuides\get_alert_content();

// Taxonomy Headings
$taxonomies = get_object_taxonomies( 'summer-guide', object );
$context['age_group_heading']=$taxonomies['age_group']->label;
$context['summer_category_heading']=$taxonomies['summer_programs_cat']->label;
$context['activity_type_heading']=$taxonomies['activity_type']->label;
$context['borough_heading']=$taxonomies['borough']->label;

Timber::render(array('list-summer-guide.twig'), $context);
