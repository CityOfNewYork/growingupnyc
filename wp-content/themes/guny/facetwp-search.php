<?php
$context = Timber::get_context();
$posts = Timber::get_posts();
if (is_array($posts)) {
  foreach ($posts as $i => $post) {
    if ($post->post_type == 'tribe_events') {
      $posts[$i] = new GunyEvent($post);
    } else if ($post->post_type == 'age') {
      $age_groups = $post->terms('age_group');
      if( $age_groups ) {
        $post->age_group = $age_groups[0];
      }
    }
  }
}
$context['posts'] = $posts;
$templates = array( 'partials/post-list.twig' );
Timber::render( $templates, $context );
