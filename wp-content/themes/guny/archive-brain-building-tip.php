<?php

/**
 * Archive for Brain Building Tips
 */

$context = Timber::get_context();
$context['top_widget'] = Timber::get_widgets('top_widget');

$context['page_title'] = BrainBuildingTip\get_title();
$context['page_tagline'] = BrainBuildingTip\get_tagline();
$context['banner'] = BrainBuildingTip\get_hero_banner_img();
$context['banner_mobile'] = BrainBuildingTip\get_hero_banner_img_mobile();
$context['post_type'] = 'brain-building-tip';

// Taxonomy Headings
$taxonomies = get_object_taxonomies( 'brain-building-tip', object );
$context['age_group_heading']=$taxonomies['age_group']->label;
$context['tip_category_group_heading']=$taxonomies['tip_category']->label;

$context['tips_link'] = get_post_type_archive_link('brain-building-tip');

Timber::render(array('list-brain-building-tip.twig'), $context);
