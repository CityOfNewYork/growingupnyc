<?php
/**
* Single entry template. Used for posts and other individual content items.
*
* To override for a particular post type, create a template named single-[post_type]
*/

$context = Timber::get_context();
$post = Timber::get_post();

if ( $post->post_type == 'age' ) {
  $age_groups = $post->terms('age_group');
  if( $age_groups ) {
    $post->age_group = $age_groups[0];
  }
  $upcoming_events = GunySite::get_featured_events( 3, array(
    array(
      'taxonomy' => 'age_group',
      'field' => 'term_id',
      'terms' => $post->age_group->id
    )
  ), true );
  // $num_remaining = 3 - count($upcoming_events);
  // if ($num_remaining > 0) {
  //   $remaining_events = GunySite::get_featured_events($num_remaining, array(
  //     array(
  //       'taxonomy' => 'age_group',
  //       'field' => 'term_id',
  //       'terms' => $post->age_group->id,
  //       'operator' => 'NOT IN'
  //     )
  //   ), false );
  //   $upcoming_events = array_merge($upcoming_events, $remaining_events);
  // }
  $context['upcoming_events'] = $upcoming_events;
} elseif ( $post->post_type == 'program' ) {
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

if($post->post_type == 'page' && strpos($post->post_name, 'youth') !== false){
  $templates = array( 'micro-site-homepage.twig' );
}
elseif($post->post_type == 'page' && strpos($post->post_name, 'disclaimer') !== false){
  $templates = array('disclaimer.twig');
}
else{
  $templates = array( 'single-' . $post->ID . '.twig', 'single-' . $post->post_type . '.twig', 'single.twig' );
}
$context['post'] = $post;

//New codes by amalan for sms intergration 
$context['shareAction'] = admin_url( 'admin-ajax.php' );
$context['shareHash'] = \SMNYC\hash($post->link);

$url = '/';
if(ICL_LANGUAGE_CODE != 'en'){
  $url = $url.ICL_LANGUAGE_CODE.'/';
}
$context['eventslink'] = $url.'events';
$context['programslink'] = $url.'programs';
Timber::render( $templates, $context );