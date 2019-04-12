<?php

namespace Templating;

/**
 * Dependencies
 */

use Wpml;
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
          // $cur_post = new GunyEvent($post);

          // // compares the event date against current date
          // date_default_timezone_set('America/New_York');
          // $cur_datetime = date('Y-m-d g:i:u');
          // $start_time = date('Y-m-d g:i:u',strtotime($cur_post->custom['_EventStartDate']));

          // if ($start_time < $cur_datetime){
          //   unset($posts[$i]);
          // } else {
          //   $posts[$i] = $cur_post;
          // }
          
          $posts[$i] = new GunyEvent($post);
          
          break;
        case 'age':
          // Add age groups to age posts
          $age_groups = $post->terms('age_group');
          if ($age_groups) {
            $post->age_group = $age_groups[0];
            // Get the English slug for icon references in templates
            $post->age_group->icon = Wpml\get_translated_term_slug(
              $post->age_group->id, 'age_group'
            );
          }
          break;
      }
    }
  }
  return $posts;
}