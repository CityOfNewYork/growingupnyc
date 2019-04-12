<?php

class Tribe__Events__Pro__Editor__Blocks__Additional_Field extends Tribe__Editor__Blocks__Abstract {

	private $slug = '';

	/**
	 * Tribe__Events__Pro__Editor__Blocks__Additional_Field constructor.
	 *
	 * @since 4.5
	 *
	 * @param $slug
	 */
	public function __construct( $slug ) {
		$this->slug = $slug;
	}

	/**
	 * Which is the name/slug of this block
	 *
	 * @since 4.5
	 *
	 * @return string
	 */
	public function slug() {
		return $this->slug;
	}

	/**
	 * Does the registration for PHP rendering for the Block, important due to been
	 * an dynamic Block
	 *
	 * @since 4.5
	 *
	 * @return void
	 */
	public function register() {
		$block_args = array(
			'render_callback' => array( $this, 'render' ),
		);

		register_block_type( $this->name(), $block_args );

		add_action( 'wp_ajax_' . $this->get_ajax_action(), array( $this, 'ajax' ) );

		$this->assets();
		$this->hook();
	}

	/**
	 * Set the default attributes of this block
	 *
	 * @since 4.5
	 *
	 * @return array
	 */
	public function default_attributes() {
		return array(
			'isPristine' => true,
			'type'       => 'text',
			'label'      => '',
			'metaKey'    => '',
			'output'     => '',
		);
	}

	/**
	 * Since we are dealing with a Dynamic type of Block we need a PHP method to render it
	 *
	 * @since 4.5
	 *
	 * @param  array $attributes
	 *
	 * @return string
	 */
	public function render( $attributes = array() ) {
		$args['attributes'] = $this->attributes( $attributes );
		// Add the rendering attributes into global context
		tribe( 'events-pro.editor.frontend.template' )->add_template_globals( $args );

		$type     = isset( $attributes['type'] ) ? $attributes['type'] : 'text';
		$location = array( 'blocks', 'additional-fields', $type );

		return tribe( 'events-pro.editor.frontend.template' )->template( $location, $args, false );
	}

	/**
	 * Register the Assets for when this block is active
	 *
	 * @since 4.5
	 *
	 * @return void
	 */
	public function assets() {
		tribe_asset(
			Tribe__Events__Pro__Main::instance(),
			'tribe-events-pro-additional-fields-fe',
			'app/additional-fields/frontend.css',
			array(),
			'wp_enqueue_scripts',
			array(
				'conditionals' => array( $this, 'has_block' ),
			)
		);
	}
}
