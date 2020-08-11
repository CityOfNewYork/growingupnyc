<?php
/**
* Single entry template. Used for posts and other individual content items.
*
* To override for a particular post type, create a template named single-[post_type]
*/

$context = Timber::get_context();
$post = Timber::get_post();

// Get the relevant programs based on category
if ( $post->post_type == 'program' ) {
  $programs_cat = $post->terms('programs_cat');
  if ( $programs_cat ) {
    $post->category = $programs_cat[0];
    $post->related_posts = Timber::get_posts( array(
      'post_type' => 'program',
      'posts_per_page' => 3,
      'post__not_in' => array($post->ID),
      'tax_query' => array(
        array(
          'taxonomy' => 'programs_cat',
          'field' => 'term_id',
          'terms' => $post->category->ID
        )
      )
    ) );
  }
}

// Brain Building Tip - Get One
$filter_args=array(
  'posts_per_page' => 1,
  'post_type' => 'brain-building-tip',
  'tax_query' => array(
    array(
      'taxonomy' => 'age_group',
      'field'    => 'slug',
      'terms'    => $post->terms('age_group')[0]->slug,
    ),
  ),
);
$query = new WP_Query($filter_args);
$context['brain_building_tip'] = Timber::get_post($query->posts[0]->ID);

$templates = 'single-program.twig';
$context['post'] = $post;

// SHARE - SMS
$context['shareAction'] = admin_url( 'admin-ajax.php' );
$context['shareHash'] = \SMNYC\hash($post->link);
$context['shareTemplate'] = "growingupnyc-".$post->post_type;

// top menu widget
$context['top_widget'] = Timber::get_widgets('top_widget');

// meta tags
$context['meta_desc'] = get_field('meta_description', $post->id);
$context['meta_keywords'] = get_field('meta_keywords', $post->id);
$context['meta_noindex'] = get_field('meta_noindex', $post->id);

// Program and Topic post alert banner
$banner = get_field('current_banner');
$context['banner']['alt'] = new TimberPost($banner);
$context['banner']['override'] = $post->update_banner;

// in-body alert under banner
$context['program_page_alert'] = get_field('banner_content', get_field('banner_alert_message', $post->id));

$context['events_link'] = get_post_type_archive_link('tribe_events');
$context['programs_link'] = get_post_type_archive_link('program');

$context['custom_favicon'] = get_field('updated_favicon', $post->id);
Timber::render( $templates, $context );