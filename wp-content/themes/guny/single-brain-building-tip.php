<?php

/**
 * Brain Building Post Type
 */

$context = Timber::get_context();
$post = Timber::get_post();

$context['post'] = $post;
$context['brain_building_tip_name'] = get_field('brain_building_tip_name', $post->id);
$context['brain_building_tip'] = get_field('brain_building_tip', $post->id, true);
$context['brainy_background'] = get_field('brainy_background', $post->id);

/**
 * Age Guides - sort in ascending order
 */
asort($post->relevant_age_guides);

/**
 * Relevant tips, 2 max
 * Assumes that there will only be one category assigned to each tip
 */
// $tip_categories = get_the_terms($post->ID, 'tip_category');
$ages = get_the_terms($post->ID, 'age_group');
$filter_args=array(
  'post__not_in' => array($post->ID),
  'posts_per_page' => 2,
  'post_type' => 'brain-building-tip',
  'tax_query' => array(
    array(
      'taxonomy' => 'age_group',
      'field'    => 'term_id',
      'terms'    => array_map(create_function('$o', 'return $o->term_id;'), $ages),
    ),
  ),
);
$tips = array();
$query = new WP_Query($filter_args);
  foreach($query->posts as $p) {
    $a = get_the_terms($p->ID, 'age_group');
    $c = get_the_terms($p->ID, 'tip_category');
    $p->age_group = $a;
    $p->tip_category = $c;
    $p->post_link = ICL_LANGUAGE_CODE != 'en'? '/'.ICL_LANGUAGE_CODE.'/brainbuilding/'.$p->post_name: '/brainbuilding/'.$p->post_name;
    array_push($tips, $p);
  }
$context['relevant_tips'] = $tips;
$context['tips_link'] = get_post_type_archive_link('brain-building-tip');
$context['ages_link'] = ICL_LANGUAGE_CODE != 'en'? '/'.ICL_LANGUAGE_CODE.'/brainbuilding/' : '/brainbuilding/';

// WPML language switcher
$context['top_widget'] = Timber::get_widgets('top_widget');

// SMS share
$context['shareAction'] = admin_url( 'admin-ajax.php' );
$context['shareHash'] = \SMNYC\hash(get_permalink($post->ID));
$context['shareTemplate'] = "growingupnyc-".$post->post_type;

// WPML language switcher
$context['top_widget'] = Timber::get_widgets('top_widget');

// SMS share
$context['shareAction'] = admin_url( 'admin-ajax.php' );
$context['shareHash'] = \SMNYC\hash(get_permalink($post->ID));
$context['shareTemplate'] = "growingupnyc-".$post->post_type;

/**
 * Render template with context
 */
Timber::render(array('single-brain-building-tip.twig'), $context);
