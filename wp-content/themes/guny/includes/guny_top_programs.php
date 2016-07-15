<?php

/**
 * Adds custom widget.
 */
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
    foreach($programs as $program) {
      echo '<div class="o-col-3 c-content-tout">';
      echo '<a class="c-content-tout__title" href="' . get_permalink($program->ID) . '">';
      echo $program->post_title;
      echo '</a></div>';
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
  register_widget( 'Top_Programs_Widget' );
});