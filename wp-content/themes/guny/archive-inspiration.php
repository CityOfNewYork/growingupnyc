<?php
/**
* Index template
*
* A fallback list template used if a more specific template is not available
*
*/
$context = Timber::get_context();

$featuredposts = array(
'post_type' => 'inspiration',
'posts_per_page' => 1,
'tax_query' => array(
  array(
    'taxonomy' => 'inspiration_group',
    'field' => 'slug',
    'terms' => 'featured-inspiration',
  ),
),
'orderby' => array(
    'date' => 'DESC'
));
$context['featuredposts'] = Timber::get_posts( $featuredposts );

$posts = array(
'post_type' => 'inspiration',
'posts_per_page' => 2,
'tax_query' => array(
  array(
    'taxonomy' => 'inspiration_group',
    'field' => 'slug',
    'terms' => 'featured-inspiration',
    'operator' => 'NOT IN',
  ),
),
'orderby' => array(
    'date' => 'DESC'
));
$context['posts'] = Timber::get_posts( $posts );

// meta tags
$context['meta_desc'] = get_field('inspiration_landing_meta_desc', 'option');
$context['meta_keywords'] = get_field('inspiration_landing_meta_keywords', 'option');

$template = 'inspiration/landing.twig';

Timber::render( $template, $context );