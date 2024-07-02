<?php

/**
 * Page Titles
 */
function guny_titles( $title ){
  $gen_pages = array("generationnyc", "trips", "topics", "inspirations");
  $_post = get_queried_object();
  // Generation single pages
  $page_type = explode("/", trim(parse_url(get_permalink(), PHP_URL_PATH), "/"));

  if ( !is_front_page() && is_single() && in_array($page_type[0], $gen_pages) ) {
    $title = $_post->post_title . ' - ' . 'Generation NYC';
  }
  if ( !is_front_page() && is_page() && in_array($page_type[0], $gen_pages) ) {
    $title = $_post->post_title . ' - ' . 'Generation NYC';
  }
  // Generation Landings
  // TO-EDIT: add landings as pages
  if ( !is_front_page() && !is_single() && in_array($page_type[0], $gen_pages) ) {
    if ( $page_type[0] == "generationnyc" && count($page_type) < 2){
      $title = "Generation NYC";
    }elseif ( $page_type[1] == "inspirations"){
      $title = "Inspirations" . ' - ' . 'Generation NYC';
    }elseif( $page_type[1] == "topics"){
      $title = "Topics" . ' - ' . 'Generation NYC';
    }elseif( $page_type[1] == "trips"){
      $title = "Trips" . ' - ' . 'Generation NYC';
    }
  }else if(is_single() && get_post_type() == "program"){
    // set the title to the program name instead of plain language
    $title=$_post->program_name . ' - ' . get_bloginfo('name', 'display');
  }
  else if(is_single() && get_post_type() == "brain-building-tip"){
    // set the title to the program name instead of plain language
    $title=$_post->brain_building_tip_name . ' - ' . get_bloginfo('name', 'display');
  }

  if ( (isset($_post->post_title) && preg_match('/search/', $_post->post_title)) || !empty($_GET['s'])) {
    $title = __('Search - Growing Up NYC', 'guny-search');
  }

  // Growing Up 404 page
  if ( ($page_type[0] == '404-2')) {
    $title = __('Page not found - Growing Up NYC');
  }

  // Generation 404 page
  if ( (is_404() && $page_type[0] == "generationnyc") || ($page_type[0] == 'generationnyc' && $page_type[1] == '404-2')) {
    $title = __('Page not found - Generation NYC');
  }

  // Update the title for the Unity Project
  if(in_array('lgbtq', $page_type)){
    $title = "NYC Unity Project - Generation NYC";
  }

  return $title;
}
add_filter( 'pre_get_document_title', 'guny_titles', 999, 1 );