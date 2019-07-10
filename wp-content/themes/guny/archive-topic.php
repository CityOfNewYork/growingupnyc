<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/
$context = Timber::get_context();
$posts = array(
'post_type' => 'program',
'posts_per_page' => 3,
'tax_query' => array(
  array(
    'taxonomy' => 'other_category',
    'field' => 'slug',
    'terms' => 'show-on-generation',
  ),
),
'orderby' => array(
    'date' => 'DESC'
));
$context['posts'] = Timber::get_posts( $posts );

$context['topic_menu'] = Timber::get_terms('topic_group', array(
  'orderby' => 'term_order',
  'hide_empty' => false,
));
$templates = array( 'list-topic.twig', 'microsite-list.twig' );

// meta tags
$context['meta_desc'] = get_field('topic_landing_meta_desc', 'option');
$context['meta_keywords'] = get_field('topic_landing_meta_keywords', 'option');

Timber::render( $templates, $context );