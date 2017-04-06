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
Timber::render( $templates, $context );
