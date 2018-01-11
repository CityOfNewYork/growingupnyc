<?php
/**
* Single entry template. Used for posts and other individual content items.
*
* To override for a particular post type, create a template named single-[post_type]
*/

$context = Timber::get_context();
$post = Timber::get_post();

// Check the language
// Global constants are not good practice...
// ... disabling error messages isn't debug friendly...
// ... disable error reporting for this line only.
error_reporting(0);
$context['language'] = ICL_LANGUAGE_CODE;
error_reporting(WP_DEBUG);

// Get the right events by age group
if ( $post->post_type == 'age' ) {
  $age_groups = $post->terms('age_group');

  if( $age_groups ) {
    $post->age_group = $age_groups[0];
    $age_group_id=$post->age_group->id;

    // reassign the age_group_id if on a spanish page
    // TO EDIT: move away from hardcoded IDs
    if ($post->age_group->slug == 'baby-es'){
      $age_group_id=7;
    }elseif ($post->age_group->slug == 'toddler-es'){
      $age_group_id=8;
    }elseif ($post->age_group->slug == 'pre-schooler-es'){
      $age_group_id=9;
    }elseif ($post->age_group->slug == 'grade-schooler-es'){
      $age_group_id=10;
    }elseif ($post->age_group->slug == 'pre-teen-es'){
      $age_group_id=11;
    }elseif ($post->age_group->slug == 'teen-es'){
      $age_group_id=100;
    }elseif ($post->age_group->slug == 'young-adult-es'){
      $age_group_id=102;
    }elseif ($post->age_group->slug == 'caregiver-es'){
      $age_group_id=43;
    }elseif ($post->age_group->slug == 'everyone-es'){
      $age_group_id=47;
    }
    // end reassignment

    $context['age_group_id'] = $age_group_id;
  }
  $upcoming_events = GunySite::get_featured_events( 3, array(
    array(
      'taxonomy' => 'age_group',
      'field' => $age_group_id,
      'terms' => $age_group_id
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

// Generation NYC homepage declaration
if($post->post_type == 'page' && strpos($post->post_name, 'generationnyc') !== false){
  $templates = array( 'micro-site-homepage.twig' );
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