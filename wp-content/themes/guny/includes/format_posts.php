<?php

namespace Templating;
use GunyEvent;

/**
 * Filter our posts and format them based on their type.
 * @param  array $posts The list of posts to format
 * @return array        The list of formatted posts
 */
function format_posts($posts) {
  if (is_array($posts)) {
    foreach ($posts as $i => $post) {
      switch ($post->post_type) {
        case 'tribe_events':
          // Format events posts
          $posts[$i] = new GunyEvent($post);
          break;
        case 'age':
          // Add age groups to age posts
          $age_groups = $post->terms('age_group');
          if ($age_groups) {
            $post->age_group = $age_groups[0];
          }
          break;
      }
    }
  }
  return $posts;
}