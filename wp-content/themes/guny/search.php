<?php

// Get the context
$context = Timber::get_context();

// The type filters
$types = array(
  'age' => 'Ages',
  'tribe_events' => 'Events',
  'programs' => 'Programs'
);

// Build the query
$query = array(
  // Get the search term
  's' => get_query_var('s', ''),
  // Get post type filter
  'post_type' => (isset($_GET['post_type'])) ? $_GET['post_type'] : 'any',
  // Get pagination
  'paged' => get_query_var('paged', 1)
);

// This cam be used to for displaying a link that prevents auto-correcting...
// but even Google just makes assumptions for corrections like 'pre k' = 'pre-k'
// so we may not need to override our autocorrect for any reason...
$autocorrected = (isset($_GET['ac'])) ? $_GET['ac'] : false;

// Autocorrect terms
if ($autocorrected !== '0') {
  $autocorrect_terms = get_field('field_5a6a00e7dda1d', 'option');
  if ($autocorrect_terms) {
    foreach ($autocorrect_terms as $key => $value) {
      $autocorrect_term = explode(' = ', $value['terms']);
      if (strtolower($query['s']) === strtolower($autocorrect_term[0])) {
        $query['s'] = $autocorrect_term[1]; // swap user term with correct term
        $autocorrected = true;
      }
    }
  }
}

// Create query
$wp_query = new WP_Query($query);
// Redo relevanssi query and get posts in Timber format.
// This block could be made more efficient by not getting the posts through
// Timber::get_posts but there needs to be a way to format the posts for the
// timber template.
$relevanssi_query = relevanssi_do_query($wp_query);
$wp_query_ids = wp_list_pluck($wp_query->posts, 'ID');
$posts = Timber::get_posts($wp_query_ids);

// Format the posts
$posts = Templating\format_posts($posts);

// URL
// if the post type filter is default don't worry about setting it to context
if ($query['post_type'] === 'any') {
  unset($query['post_type']);
}

$url = http_build_query($query);
$url = ($url) ? '?' . $url : '';

// Pagination
$pagination = $query;
unset($pagination['paged']);

if (get_previous_posts_link()) {
  $previous = array(
    'paged' => $paged - 1
  );
  $previous = array_merge($pagination, $previous);
  $previous = http_build_query($previous);
  $previous = ($previous) ? '?' . $previous : '';
}

if (get_next_posts_link()) {
  $next = array(
    'paged' => $paged + 1
  );
  $next = array_merge($pagination, $next);
  $next = http_build_query($next);
  $next = ($next) ? '?' . $next : '';
}

// Set Context
// if the post type filter is default don't worry about setting it to context
$context = array_merge($context, $query);
$context['url'] = $url;
$context['autocorrected'] = $autocorrected;
$context['types'] = $types;
$context['posts'] = $posts;
$context['language'] = ICL_LANGUAGE_CODE;
$context['previous'] = (isset($previous)) ? $previous : false;
$context['next'] = (isset($next)) ? $next : false;

// Compile templates for search template
$templates_form = array('partials/search-form.twig');
$templates_filters = array('partials/search-filters.twig');
$templates_results = array('partials/post-list.twig');
$templates_pagination = array('partials/pagination.twig');
$context['search'] = Timber::compile($templates_form, $context);
$context['facet_post_type'] = Timber::compile($templates_filters, $context);
$context['results'] = Timber::compile($templates_results, $context);
$context['pagination'] = Timber::compile($templates_pagination, $context);

// Render view
$templates = array('search.twig');
Timber::render($templates, $context);