<?php

/**
 * Archive for After School Guide (landing page, list view)
 */

$context = Timber::get_context();
$context['posts'] = Timber::get_posts();

$path = '/afterschool';

$post = Timber::get_post(Templating\get_controller_id($path));
$context['post'] = $post;

$context['page_title'] = Templating\get_title($path);
$context['page_tagline'] = Templating\get_tagline($path);
$context['banner'] = Templating\get_hero_banner_img($path);
$context['programs_alert'] = Templating\get_alert_content($path);
$context['post_type'] = 'afterschool-guide';

// Taxonomy Headings
$taxonomies = get_object_taxonomies( 'afterschool-guide', object );
$context['age_group_heading']=$taxonomies['age_group']->label;
$context['afterschool_category_heading']=$taxonomies['afterschool_programs_cat']->label;
$context['borough_heading']=$taxonomies['borough']->label;

// meta tags
$context['meta_desc'] = get_field('meta_description', Templating\get_controller_id($path));
$context['meta_keywords'] = get_field('meta_keywords', Templating\get_controller_id($path));
$context['meta_noindex'] = get_field('meta_noindex', Templating\get_controller_id($path));

$template = 'afterschool-guide/archive.twig';

Timber::render($template, $context);
