<?php

Notifications\timber();

// The type filters
$types = array(
  'age' => 'Ages',
  'tribe_events' => 'Events',
  'programs' => 'Programs'
);

// Get the search term
$term = (isset($_GET['s'])) ? $_GET['s'] : '';
$type = (isset($_GET['type'])) ? $_GET['type'] : '';
// This could be used to not auto-correct in the future... but even Google just
// makes assumptions for corrections like 'pre k' = 'pre-k' so we may not need
// to override our autocorrect for any reason.
$autocorrected = (isset($_GET['ac'])) ? $_GET['ac'] : false;

// Autocorrect terms
if ($autocorrected !== '0') {
  $autocorrect_terms = get_field('field_5a6a00e7dda1d', 'option');
  foreach ($autocorrect_terms as $key => $value) {
    $autocorrect_term = explode(' = ', $value['terms']);
    if (strtolower($term) === strtolower($autocorrect_term[0])) {
      $term = $autocorrect_term[1]; // swap user term with correct term
      $autocorrected = true;
    }
  }
}

// Create query
$wp_query = new WP_Query(array(
  's' => $term,
  'post_type' => ($type) ? $type : 'any'
));

// Redo relevanssi query and get posts in Timber format.
// This block could be made more efficient by not getting the posts through
// Timber::get_posts but there needs to be a way to format the posts for the
// timber template.
$relevanssi_query = relevanssi_do_query($wp_query);
$wp_query_ids = wp_list_pluck($wp_query->posts, 'ID');
$posts = Timber::get_posts($wp_query_ids);

// Post filtering
// This functionality should be available in functions.php
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

// Set Context
$context = Timber::get_context();
$context['autocorrected'] = $autocorrected;
$context['term'] = $term;
$context['types'] = $types;
$context['type'] = $type;
$context['posts'] = $posts;
$context['language'] = ICL_LANGUAGE_CODE;

// Compile templates for search template
$templates_form = array('partials/search-form.twig');
$templates_filters = array('partials/search-filters.twig');
$templates_results = array('partials/post-list.twig');
$context['search'] = Timber::compile($templates_form, $context);
$context['facet_post_type'] = Timber::compile($templates_filters, $context);
$context['results'] = Timber::compile($templates_results, $context);

// Render view
$templates = array('search.twig');
Timber::render($templates, $context);