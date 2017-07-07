<?php
/*
Plugin Name: TestPlugin
Version: 1.0
Author: Amalan
Description: This is my first module in WP
*/

function magazine_post_type() {
	register_post_type( 'magazine_',
		array(
			'labels' => array(
				'name' => __( 'Magazine Posts' ),
				'singular_name' => __( 'Magazine Edition' ),
				'add_new_item' => __( 'Create a New Edition' ) 
			),
			'exclude_from_search' => true,
			'capability_type' => 'page',
			'has_archive' => true,
			'menu_position' => 10,
			'public' => true,
			'publicly_queryable' => true,
			'rewrite' => array( 'slug' => 'magazine', 'with_front' => true ),
			'show_ui' => true,
			'supports' => array( 'editor', 'title', 'thumbnail', 'excerpt', 'page-attributes'),
			'taxonomies' => array( 'post_tag' )
		)
	);
}

add_action( 'init', 'magazine_post_type' );

?>	