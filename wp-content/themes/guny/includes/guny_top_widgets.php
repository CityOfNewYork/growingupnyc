<?php

/**
 * Adds custom widgets.
 */

class Top_Afterschool_Widget extends WP_Widget {

  /**
   * Register widget with WordPress.
   */
  function __construct() {
    parent::__construct(
      'top_afterschool_widget', // Base ID
      __('Top After School Settings', 'text_domain'), // Name
      array( 'description' => __( 'Manually selected after school.', 'text_domain' ), ) // Args
    );  
  }

  /**
   * Front-end display of widget.
   *
   * @see WP_Widget::widget()
   *
   * @param array $args     Widget arguments.
   * @param array $instance Saved values from database.
   */
  public function widget( $args, $instance ) {
    $activities = get_field('activities', 'widget_' . $args['widget_id']);
    echo get_search_widget_container($activities, 'afterschool-guide');    
  }

  /**
   * Back-end widget form.
   *
   * @see WP_Widget::form()
   *
   * @param array $instance Previously saved values from database.
   */
  public function form( $instance ) {
    ?>
    <br>
    <?php
  }

}

class Top_Summer_Widget extends WP_Widget {

  /**
   * Register widget with WordPress.
   */
  function __construct() {
    parent::__construct(
      'top_summer_widget', // Base ID
      __('Top Summer Settings', 'text_domain'), // Name
      array( 'description' => __( 'Manually selected top summer activities.', 'text_domain' ), ) // Args
    );
  }

  /**
   * Front-end display of widget.
   *
   * @see WP_Widget::widget()
   *
   * @param array $args     Widget arguments.
   * @param array $instance Saved values from database.
   */
  public function widget( $args, $instance ) {
    $activities = get_field('activities', 'widget_' . $args['widget_id']);
    echo get_search_widget_container($activities, 'summer-guide');
  }

  /**
   * Back-end widget form.
   *
   * @see WP_Widget::form()
   *
   * @param array $instance Previously saved values from database.
   */
  public function form( $instance ) {
    ?>
    <br>
    <?php
  }

}
class Top_Programs_Widget extends WP_Widget {

  /**
   * Register widget with WordPress.
   */
  function __construct() {
    parent::__construct(
      'top_programs_widget', // Base ID
      __('Top Programs Settings', 'text_domain'), // Name
      array( 'description' => __( 'Manually selected top programs.', 'text_domain' ), ) // Args
    );
  }

  /**
   * Front-end display of widget.
   *
   * @see WP_Widget::widget()
   *
   * @param array $args     Widget arguments.
   * @param array $instance Saved values from database.
   */
  public function widget( $args, $instance ) {
    $programs = get_field('programs', 'widget_' . $args['widget_id']);
    echo get_search_widget_container($programs, 'program');
  }

  /**
   * Back-end widget form.
   *
   * @see WP_Widget::form()
   *
   * @param array $instance Previously saved values from database.
   */
  public function form( $instance ) {
    ?>
    <br>
    <?php
  }

}
class Top_Topics_Widget extends WP_Widget {

  /**
   * Register widget with WordPress.
   */
  function __construct() {
    parent::__construct(
      'top_topics_widget', // Base ID
      __('Top Topic Settings', 'text_domain'), // Name
      array( 'description' => __( 'Manually selected top topics.', 'text_domain' ), ) // Args
    );
  }

  /**
   * Front-end display of widget.
   *
   * @see WP_Widget::widget()
   *
   * @param array $args     Widget arguments.
   * @param array $instance Saved values from database.
   */
  public function widget( $args, $instance ) {
    $topics = get_field('topics', 'widget_' . $args['widget_id']);
    echo get_search_widget_container($topics, 'topic');
  }

  /**
   * Back-end widget form.
   *
   * @see WP_Widget::form()
   *
   * @param array $instance Previously saved values from database.
   */
  public function form( $instance ) {
    ?>
    <br>
    <?php
  }

}

class Top_Inspirations_Widget extends WP_Widget {

  /**
   * Register widget with WordPress.
   */
  function __construct() {
    parent::__construct(
      'top_inspirations_widget', // Base ID
      __('Top Inspiration Settings', 'text_domain'), // Name
      array( 'description' => __( 'Manually selected top inspirations.', 'text_domain' ), ) // Args
    );
  }

  /**
   * Front-end display of widget.
   *
   * @see WP_Widget::widget()
   *
   * @param array $args     Widget arguments.
   * @param array $instance Saved values from database.
   */
  public function widget( $args, $instance ) {
    $inspirations = get_field('inspirations', 'widget_' . $args['widget_id']);
    echo get_search_widget_container($inspirations, 'inspiration');
  }

  /**
   * Back-end widget form.
   *
   * @see WP_Widget::form()
   *
   * @param array $instance Previously saved values from database.
   */
  public function form( $instance ) {
    ?>
    <br>
    <?php
  }

}

class Top_Trips_Widget extends WP_Widget {

  /**
   * Register widget with WordPress.
   */
  function __construct() {
    parent::__construct(
      'top_trips_widget', // Base ID
      __('Top Trip Settings', 'text_domain'), // Name
      array( 'description' => __( 'Manually selected top trips.', 'text_domain' ), ) // Args
    );
  }

  /**
   * Front-end display of widget.
   *
   * @see WP_Widget::widget()
   *
   * @param array $args     Widget arguments.
   * @param array $instance Saved values from database.
   */
  public function widget( $args, $instance ) {
    $trips = get_field('trips', 'widget_' . $args['widget_id']);
    echo get_search_widget_container($trips, 'trip');
  }

  /**
   * Back-end widget form.
   *
   * @see WP_Widget::form()
   *
   * @param array $instance Previously saved values from database.
   */
  public function form( $instance ) {
    ?>
    <br>
    <?php
  }

}

// Creates the html string for all widgets
function get_search_widget_container($posts, $post_type){
  $plural_name = get_post_type_object($post_type)->labels->name;
  $act_arr = ['afterschool-guide', 'summer-guide'];
  
  if (in_array($post_type, $act_arr)) {
    $archive_type = 'activities';
  } else {
    $archive_type = $plural_name;
  }
  echo '<section class="o-col__divider c-block-list">';
  echo '<h2 class="c-block-list__heading">' . __($plural_name, 'guny-search');
  echo '<a class="c-block-list__link" href="'.get_post_type_archive_link($post_type).'">'. __('See all ' . strtolower($archive_type), 'guny-search').'<svg role="img" class="icon--caret--xxsmall" aria-hidden="true"><use xlink:href="#icon-caret-right"></use></svg></a>';
  echo '</h2>';
  echo '<div class="c-block-list__inner o-row">';   

  foreach($posts as $post) {
    echo '<div class="o-col-3 c-content-tout">';
    echo '<h3 class="c-content-tout__title">';
    if($post_type == 'inspiration'){
      echo '<a rel="bookmark" title="' . get_field('page_top_heading', $post->ID) . '" href="' . get_permalink($post->ID) . '">';
      echo get_field('page_top_heading', $post->ID);
      echo '</a></h3>';
    } else {
      echo '<a rel="bookmark" title="' . $post->post_title . '" href="' . get_permalink($post->ID) . '">';
      echo $post->post_title;
      echo '</a></h3>';
    }
    if($post_type == 'trip'){
      $address=get_field('map', $post->ID)['address'];
      echo '<div class="c-content-tout__link">';
      echo '<svg role="img" class="icon--xxsmall" aria-hidden="true"><use xlink:href="#icon-map-marker"></use></svg>';
      echo '<a href="https://www.google.com/maps/search/?api=1&query='.$address.'" target="_blank">'.$address.'</a>';
      echo '</div>';
    }
    echo '</div>';
  }
  echo '</div>';
  echo '</section>';
}

// register Search widgets
add_action( 'widgets_init', function(){
  register_widget( 'Top_Programs_Widget' );
  register_widget( 'Top_Afterschool_Widget' );
  register_widget( 'Top_Summer_Widget' );
  register_widget( 'Top_Topics_Widget' );
  register_widget( 'Top_Inspirations_Widget' );
  register_widget( 'Top_Trips_Widget' );
});