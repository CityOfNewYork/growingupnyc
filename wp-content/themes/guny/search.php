<?php

/*
Template Name: Search
*/

// Get the context
$context = Timber::get_context();

// Get the query and validate parameters
$query = Search\get_query(ICL_LANGUAGE_CODE);

// Auto correct the search term
$query['s'] = Search\auto_correct($query['s']);

if( !$query['post_type'] ){
  $query['post_type'] = Search\get_search_post_types();
}

// $query['tax_query'] = Search\GEN_TAXONOMIES;

/***************/
// Create query
$wp_query = new WP_Query($query);
// Redo relevanssi query and get posts in Timber format. This block could be
// made more efficient by not getting the posts through Timber::get_posts but
// there needs to be a way to format the posts for the timber template.
$relevanssi_query = relevanssi_do_query($wp_query);

$wp_query_ids = array_column($relevanssi_query, 'ID');

// get the posts
$posts = Timber::get_posts($wp_query_ids);
$posts = Templating\format_posts($posts); // Format the posts per type

/***************/

// Set context
$context = array_merge($context, $query);
$context['types'] = Search\search_filters();
if ( ICL_LANGUAGE_CODE == 'es') {
  array_splice($context['types'], -1);
}

$context['posts'] = $posts;
$context['pagination'] = Search\pagination($query, $wp_query->max_num_pages);
$context['previous'] = $context['pagination']['previous'];
$context['next'] = $context['pagination']['next'];
$context['translation_domain'] = Search\TRANSLATION_DOMAIN;

// check the language
$context['language'] = ICL_LANGUAGE_CODE;
$context['search_term'] = $query['s'];
$context['no_results'] = Search\get_no_results_msg();

// Compile templates for search template
$templates_form = array('partials/search-form.twig');
$templates_filters = array('partials/search-filters.twig');
$templates_results = array('partials/post-list.twig');
$templates_pagination = array('partials/pagination.twig');
$context['search'] = Timber::compile($templates_form, $context);
$context['facet_post_type'] = Timber::compile($templates_filters, $context);
$context['results'] = Timber::compile($templates_results, $context);
$context['pagination'] = Timber::compile($templates_pagination, $context);
$context['top_widget'] = Timber::get_widgets('top_widget');

$templates = array('search.twig');

Timber::render($templates, $context);
