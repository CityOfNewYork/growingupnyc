<?php

/**
 * Archive for Brain Building Tips
 */

$context = Timber::get_context();
$context['top_widget'] = Timber::get_widgets('top_widget');

$path = '/brainbuilding';

$context['page_title'] = Templating\get_title($path);
$context['page_tagline'] = Templating\get_tagline($path);
$context['banner'] = Templating\get_hero_banner_img($path);
$context['banner_mobile'] = Templating\get_hero_banner_img_mobile($path);
$context['post_type'] = 'brain-building-tip';

// Taxonomy Headings
$taxonomies = get_object_taxonomies( 'brain-building-tip', object );
$context['age_group_heading']=$taxonomies['age_group']->label;
$context['tip_category_group_heading']=$taxonomies['tip_category']->label;

// meta tags
$context['meta_desc'] = get_field('meta_description', Templating\get_controller_id($path));
$context['meta_keywords'] = get_field('meta_keywords', Templating\get_controller_id($path));
$context['meta_noindex'] = get_field('meta_noindex', Templating\get_controller_id($path));
  
Timber::render(array('list-brain-building-tip.twig'), $context);
