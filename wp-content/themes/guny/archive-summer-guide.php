<?php

/**
 * Archive for Summer Guides (landing page, list view)
 */

$context = Timber::get_context();

$templates = array('list-summer-guide.twig');

$context['custom_switcher'] = Timber::compile(
  array('partials/language-switcher.twig'),
  array(
    'languages' => Wpml\get_wpdb_languages(),
    'current' => ICL_LANGUAGE_CODE
  )
);

Timber::render($templates, $context);