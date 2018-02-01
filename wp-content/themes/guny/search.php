<?php

// Get the context
$context = Timber::get_context();

// Get the query and validate parameters
$query = Search\get_query();

// Autocorrect search term
$auto_correct_terms = get_field('field_5a6a00e7dda1d', 'option');
if ($auto_correct_terms) {
  $query['s'] = Search\auto_correct($query['s'], $auto_correct_terms);
}

// Create query
$wp_query = new WP_Query($query);
// Redo relevanssi query and get posts in Timber format. This block could be
// made more efficient by not getting the posts through Timber::get_posts but
// there needs to be a way to format the posts for the timber template.
$relevanssi_query = relevanssi_do_query($wp_query);
$wp_query_ids = wp_list_pluck($wp_query->posts, 'ID');
$posts = Timber::get_posts($wp_query_ids);
$posts = Templating\format_posts($posts); // Format the posts per type

// Set Context
$context = array_merge($context, $query);
$context['types'] = Search\FILTER_TYPES;
$context['posts'] = $posts;
$context['language'] = ICL_LANGUAGE_CODE;
$context['pagination'] = Search\pagination($query, $wp_query->max_num_pages);
$context['previous'] = $context['pagination']['previous'];
$context['next'] = $context['pagination']['next'];

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