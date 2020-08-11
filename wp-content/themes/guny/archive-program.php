<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/
$context = Timber::get_context();

$path = '/programs';

$context['page_title'] = Templating\get_title($path);
$context['page_tagline'] = Templating\get_tagline($path);
$context['programs_alert'] = Templating\get_alert_content($path);
$context['post_type'] = 'program';

// meta tags
$context['meta_desc'] = get_field('meta_description', Templating\get_controller_id($path));
$context['meta_keywords'] = get_field('meta_keywords', Templating\get_controller_id($path));
$context['meta_noindex'] = get_field('meta_noindex', Templating\get_controller_id($path));

$context['top_widget'] = Timber::get_widgets('top_widget');
// Taxonomy Headings
$taxonomies = get_object_taxonomies( 'program', object );
$context['age_group_heading']=$taxonomies['age_group']->label;
$context['program_category_heading']=$taxonomies['programs_cat']->label;

$template = 'program/archive.twig';
Timber::render( $template, $context );
