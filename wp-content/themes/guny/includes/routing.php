<?php

/**
 * Redirects for Generation NYC archives and posts.
 * These may not be needed once we do a search and replace of the database.
 */

/**
 * Dependencies
 */

use Search as Search;

/**
 * Routes
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
  if (Search\visible() || !empty($_GET['s'])) {
    Routes::load('search.php', $params, null, 200);
  } else {
    wp_redirect('/'); exit;
  }
});

Routes::map('/generationnyc/search', function($params) {
  if (Search\visible() || !empty($_GET['s'])) {
    Routes::load('search.php', $params, null, 200);
  } else {
    wp_redirect('/'); exit;
  }
});

// Redirect default Wordpress search to our route
add_action('template_redirect', 'search');
function search() {
  if (!empty($_GET['s'])){
    Routes::load('search.php', $params, null, 200);
  }
}

/**
 * Programs
 * Load the program archive to the /programs
 */
Routes::map('/programs', function($params) {
  Routes::load('archive-program.php', $params, null, 200);
});

 /**
 * Generation 404
 * Load the 404 template when /404 path is used in URL. Without this, a user is sent to the homepage
 */
Routes::map('/generationnyc/404', function($params) {
  Routes::load('404.php', $params, null, 404);
});