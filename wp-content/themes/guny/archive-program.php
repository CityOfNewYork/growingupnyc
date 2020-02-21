<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/
$context = Timber::get_context();
$context['top_widget'] = Timber::get_widgets('top_widget');
$templates = array( 'list-program.twig', 'list.twig' );

$context['post_type'] = 'program';
// meta tags
$context['meta_desc'] = get_field('program_landing_meta_desc', 'option');
$context['meta_keywords'] = get_field('program_landing_meta_keywords', 'option');

// Taxonomy Headings
$taxonomies = get_object_taxonomies( 'program', object );
$context['age_group_heading']=$taxonomies['age_group']->label;
$context['program_category_heading']=$taxonomies['programs_cat']->label;

// check the language
$context['language'] = ICL_LANGUAGE_CODE;

Timber::render( $templates, $context );
