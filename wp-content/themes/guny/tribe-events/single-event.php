<?php
/**
 * Single Event Template
 *
 * Overrides plugin template
 *
 * @package TribeEventsCalendar
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

$context = Timber::get_context();
$post = Timber::get_post(false, 'GunyEvent');
$templates = array( 'single-event.twig', 'single.twig' );
$context['post'] = $post;
// check the language
$context['language'] = ICL_LANGUAGE_CODE;

$context['custom_switcher'] = Timber::compile(
  array('partials/language-switcher.twig'),
  array(
    'languages' => Wpml\get_wpdb_languages(),
    'current' => $context['language']
  )
);

Timber::render( $templates, $context );
