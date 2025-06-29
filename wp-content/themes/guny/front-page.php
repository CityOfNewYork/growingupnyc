<?php
/**
* Front Page
*/
$context = Timber::get_context();
$context['post'] = Timber::get_post();

// meta tags
$context['meta_desc'] = $post->meta_description;
$context['meta_keywords'] = $post->meta_keywords;
$context['meta_noindex'] = $post->meta_noindex;

$featured_image = get_the_post_thumbnail_url($post);
$context['featured_image'] = $featured_image;

/**
 * Top 3 programs based on date published
 */
$filter_args=array(
  'posts_per_page' => 3,
  'post_type' => 'program',
  'orderby' => 'date',
  'order' => 'ASC',
);
$programs = array();
$query = new WP_Query($filter_args);
foreach($query->posts as $p) {
  $a = get_the_terms($p->ID, 'programs_cat');
  $p->programs_cat = $a;
  $p->link = ICL_LANGUAGE_CODE != 'en'? '/'.ICL_LANGUAGE_CODE.'/programs/'.$p->post_name: '/programs/'.$p->post_name;
  array_push($programs, $p);
}
$context['top_programs']=$programs;

$template = 'home.twig';

Timber::render( $template, $context );