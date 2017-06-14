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


//Inject custom language context manually in Events
global $wp;
$postlink = add_query_arg(array(),$wp->request);

$languagearray = array("en" => "English" , "es" => "Español");	
$output = '';
$output .= '<div class="c-language-switcher-wrapper">';
$output .=	'<div class="o-container c-language__switcher">';
$output .=		'<div class="wpml-ls-sidebars-top_widget wpml-ls wpml-ls-legacy-list-horizontal">';
$output .=  		'<ul>';
foreach ($languagearray as $key => $value) {
	$output .= '<li class="wpml-ls-slot-top_widget wpml-ls-item wpml-ls-item-'.$key; 
	if($key == ICL_LANGUAGE_CODE){
		$output .= ' wpml-ls-current-language';
	}
	$output .= ' wpml-ls-item-legacy-list-horizontal">';
	if($key == 'en'){
		$output .=	'<a href="'.home_url().'/'.$postlink.'"><span class="wpml-ls-native">'.$value.'</span></a>';
	}
	else{
		$output .=	'<a href="'.home_url().'/'.$key.'/'.$postlink.'"><span class="wpml-ls-native">'.$value.'</span></a>';
	}
  $output .= '</li>';
}
$output .= 			'</ul>';
$output .=		'</div>';
$output .=	'</div>';
$output .= '</div>';

$context['custom_switcher'] = $output;

Timber::render( $templates, $context );
