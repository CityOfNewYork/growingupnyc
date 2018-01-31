<?php

/**
 * Redirects for Generation NYC archives and posts.
 * These may not be needed once we do a search and replace of the database.
 */

function load($params, $endpoint) {
  $params['endpoint'] = $endpoint;
  Routes::load('redirect-generationnyc.php', $params, null, 200);
}

// Topics
Routes::map('/topics', function($params) {
  load($params, 'topics');
});

Routes::map('/topics/:post', function($params) {
  load($params, 'topics/'.$params['post']);
});

// Inspirations
Routes::map('/inspirations', function($params) {
  load($params, 'inspirations/');
});

Routes::map('/inspirations/:post', function($params) {
  load($params, 'inspirations/'.$params['post']);
});

// Trips
Routes::map('/trips', function($params) {
  load($params, 'trips');
});

Routes::map('/trips/:post', function($params) {
  load($params, 'trips/'.$params['post']);
});


/**
 * Search
 * We redirect the default homepage search to our /search url and use the same
 * templates Wordpress would use.
 */

Routes::map('/search', function($params) {
  Routes::load('search.php', $params, null, 200);
});

// redirect default Wordpress search to our route
// function search() {
//   if (is_search() && !empty($_GET['s'])) {
//     wp_redirect(home_url('/search/?s=') . urlencode(get_query_var('s')));
//     exit();
//   }
// }

// add_action('template_redirect', 'search');
