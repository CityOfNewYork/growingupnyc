<?php

/**
 * Adds custom widget.
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
    foreach($activities as $activity) {
      echo '<div class="o-col-3 c-content-tout">';
      echo '<h3 class="c-content-tout__title">';
      echo '<a rel="bookmark" title="' . $activity->post_title . '" href="' . get_permalink($activity->ID) . '">';
      echo $activity->post_title;
      echo '</a></h3></div>';
    }
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

} // class Top_Programs_Widget

// register Top_Programs_Widget widget
add_action( 'widgets_init', function(){
  register_widget( 'Top_Afterschool_Widget' );
});