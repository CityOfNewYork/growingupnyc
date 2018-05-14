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

// top menu widget
$context['top_widget'] = Timber::get_widgets('top_widget');

Timber::render( $templates, $context );
