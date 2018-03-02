<?php

/**
 * Archive for Summer Guides (landing page, list view)
 */

$context = Timber::get_context();

$templates = array('list-summer-guide.twig');

Timber::render($templates, $context);