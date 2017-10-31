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
		$output .=	'<a href="'.site_url().'/'.$postlink.'"><span class="wpml-ls-native">'.$value.'</span></a>';
	}
	else{
		$output .=	'<a href="'.site_url().'/'.$key.'/'.$postlink.'"><span class="wpml-ls-native">'.$value.'</span></a>';
	}
  $output .= '</li>';
}
$output .= 			'</ul>';
$output .=		'</div>';
$output .=	'</div>';
$output .= '</div>';

$context['custom_switcher'] = $output;

// getting the correct url for the spanish tags
// TO EDIT: modify hardcoded Names and id values
// get array of taxonomies
$age_groups = $post->terms('age_group');
// $context['age_groups'] = $age_groups;

for ($i = 0; $i <= count($age_groups); $i++) {
  if ($age_groups[$i] == 'Bebé' || $age_groups[$i] == 'Baby'){
    $age_groups[$i]=7;
  }elseif ($age_groups[$i] == 'Niño pequeño' || $age_groups[$i] =='Toddler'){
    $age_groups[$i]=8;
  }elseif ($age_groups[$i] == 'Preescolar' || $age_groups[$i] =='Pre-Schooler'){
    $age_groups[$i]=9;
  }elseif ($age_groups[$i] == 'Alumno de escuela primaria' || $age_groups[$i] =='Grade-Schooler'){
    $age_groups[$i]=10;
  }elseif ($age_groups[$i] == 'Preadolescente' || $age_groups[$i] =='Pre-Teen'){
    $age_groups[$i]=11;
  }elseif ($age_groups[$i] == 'Adolescente' || $age_groups[$i] =='Teen'){
    $age_groups[$i]=100;
  }elseif ($age_groups[$i] == 'Adulto joven' || $age_groups[$i] =='Young-Adult'){
    $age_groups[$i]=102;
  }elseif ($age_groups[$i] == '(es) Caregiver' || $age_groups[$i] =='Caregiver'){
    $age_groups[$i]=43;
  }elseif ($age_groups[$i] == '(es) All Age Groups' || $age_groups[$i] =='Everyone'){
    $age_groups[$i]=47;
  }
}
$context['age_groups'] = $age_groups;

// end get correct url

Timber::render( $templates, $context );
