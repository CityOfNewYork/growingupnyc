<?php
/**
 * Facilitates setup of the query used to generate the /all/ events page.
 */
class Tribe__Events__Pro__Recurrence__Event_Query {
	/** @var WP_Query */
	protected $query;
	protected $slug = '';
	protected $parent_event;


	/**
	 * This is expected to be called in the context of the tribe_events_pre_get_posts
	 * action and only when it has already been determined that the request is to see
	 * all events making up a recurring sequence.
	 *
	 * @see Tribe__Events__Pro__Main::pre_get_posts()
	 *
	 * @param WP_Query $query
	 */
	public function __construct( WP_Query $query = null ) {
		if ( $query instanceof WP_Query ) {
			$this->query = $query;
			$this->slug = $query->get( 'name' );
		}
	}

	/**
	 * Abuse the WP action to do one last check on the 'all' page to avoid showing a page without anything on it.
	 * @return void
	 */
	public function verify_all_page() {
		if ( ! $wp_query = tribe_get_global_query_object() ) {
			return;
		}

		/**
		 * If we got this far and there are not posts we need to fetch at least the parent to
		 * prevent bugs with the page throwing a 404
		 */
		if ( empty( $wp_query->posts ) && isset( $wp_query->query_vars['post_parent'] ) ) {
			$wp_query->posts = array(
				get_post( $wp_query->query_vars['post_parent'] ),
			);
		}
	}

	/**
	 * Attach all the hooks associated with this class
	 *
	 * @since 4.4.26
	 */
	public function hook() {
		if ( empty( $this->slug ) ) {
			return;
		}

		$this->setup();
	}

	/**
	 * If appropriate, mould the query to obtain all events belonging to the parent
	 * event of the sequence. Additionally may set up a filter to append a where clause
	 * to obtain the parent post in the same query.
	 */
	protected function setup() {
		unset( $this->query->query_vars['name'] );
		unset( $this->query->query_vars['tribe_events'] );

		$this->get_parent_event();

		if ( empty( $this->parent_event ) ) {
			$this->setup_for_404();
		} else {
			//Query Private Events if Logged In
			$status = current_user_can( 'read_private_tribe_events' ) ? array( 'publish', 'private' ) : 'publish';

			$this->query->set( 'post_parent', $this->parent_event->ID );
			$this->query->set( 'post_status', $status );
			$this->query->set( 'posts_per_page', tribe_get_option( 'postsPerPage', 10 ) );
			$this->query->set( 'tribe_remove_date_filters', $this->should_remove_date_filters() );

			// Configure what this page actually is
			$this->query->is_singular = false;
			$this->query->is_archive = true;
			$this->query->is_post_type_archive = true;

			add_filter( 'posts_where', array( $this, 'include_parent_event' ) );
			add_filter( 'posts_orderby', array( $this, 'orderby_event_date' ), 100 );
			add_action( 'wp', array( $this, 'verify_all_page' ) );
		}
	}

	/**
	 * Obtains the parent event post given the slug currently being queried for.
	 */
	protected function get_parent_event() {

		//Query Parent Private Events if Logged In
		$status = current_user_can( 'read_private_tribe_events' ) ? array( 'publish', 'private' ) : 'publish';

		$posts = get_posts( array(
			'name'        => $this->slug,
			'post_type'   => Tribe__Events__Main::POSTTYPE,
			'post_status' => $status,
			'numberposts' => 1,
		) );

		$this->parent_event = reset( $posts );
	}

	/**
	 * Set from the outside the parent event associated with this event
	 *
	 * @since 4.4.26
	 *
	 * @param $parent_post
	 */
	public function set_parent_event( WP_Post $parent_post ) {
		$this->parent_event = $parent_post;
	}

	/**
	 * Effectively trigger a 404, ie if the provided slug was invalid.
	 */
	protected function setup_for_404() {
		$this->query->set( 'p', -1 );
	}

	/**
	 * Ensures the parent event is also included in the query results.
	 *
	 * @param  string $where_sql
	 *
	 * @return string
	 */
	public function include_parent_event( $where_sql ) {
		global $wpdb;

		// Run once only!
		remove_filter( 'posts_where', array( $this, 'include_parent_event' ) );

		$parent_id      = absint( $this->parent_event->ID );
		$where_children = " {$wpdb->posts}.post_parent = $parent_id ";
		$where_parent   = " {$wpdb->posts}.ID = $parent_id ";
		$where_either   = " ( $where_children OR $where_parent ) ";

		return str_replace( $where_children, $where_either, $where_sql );
	}

	/**
	 * Ensure the query orders by event start date rather than post date.
	 *
	 * Without this step the results may be in an unexpected order, particularly for more
	 * complicated recurrence patterns or patterns that have been amended (and the post date
	 * does not reflect the true date order).
	 *
	 * @param string $orderby_sql
	 *
	 * @return string
	 */
	public function orderby_event_date( $orderby_sql ) {
		global $wpdb;

		// Run once only!
		remove_filter( 'posts_orderby', array( $this, 'orderby_event_date' ), 100 );

		// Check if a meta query is set and grab the first query
		$first_meta_query = Tribe__Utils__Array::get( $this->query->meta_query->queries, array( 0 ), false );

		// If not set or it does not relate to the EventStartDate, bail
		if (
			! $first_meta_query
			|| (
				'_EventStartDate' !== $first_meta_query['key']
				&& '_EventStartDateUTC' !== $first_meta_query['key']
			)
		) {
			return $orderby_sql;
		}

		$original_orderby_sql = $orderby_sql;
		$expected_orderby = $wpdb->postmeta . '.meta_value ASC';

		// Only modify the orderby fragment if necessary
		if (
			! empty( $original_orderby_sql )
			&& $original_orderby_sql !== $expected_orderby
		) {
			$orderby_sql = $expected_orderby . ', ' . $original_orderby_sql;
		}

		/**
		 * Provides an opportunity to override the orderby-SQL fragment for the /all/ page.
		 *
		 * @param string   $orderby_sql
		 * @param string   $original_orderby_sql
		 * @param WP_Query $query
		 */
		return apply_filters( 'tribe_events_pro_all_event_query_orderby_sql', $orderby_sql, $original_orderby_sql, $this->query );
	}

	/**
	 * Indicates if date filters should be removed for /all/ queries or not.
	 *
	 * Removing the date filters will expose past events from the series, while keeping
	 * them means only upcoming instances will be queried for.
	 *
	 * The default is to only ever remove date filters in the context of the main query
	 * and then only if there are no upcoming events in the series. The twin goals are
	 * to provide more relevant data to typical users (most visitors won't want to see
	 * expired events for a series) while avoiding 404s (which would happen if we apply
	 * date filters but there are no upcoming events in the series).
	 *
	 * @since 4.4.14
	 *
	 * @return bool
	 */
	protected function should_remove_date_filters() {
		$remove_date_filters = false;

		$upcoming_instances = tribe_get_events( array(
			'post_parent'    => $this->parent_event->ID,
			'eventDisplay'   => 'list',
			'fields'         => 'ids',
			'posts_per_page' => 1,
		) );

		if ( ! count( $upcoming_instances ) && $this->query->is_main_query() ) {
			$remove_date_filters = true;
		}

		/**
		 * Dictates whether date filters should be removed for the /all/ page query or not.
		 *
		 * Removing the date filters means *all* instances including past event instances will
		 * be queried for. Not removing them means only upcoming instances will be returned:
		 * the default behaviour is to remove them only if there are no upcoming events in the
		 * series.
		 *
		 * @since 4.4.14
		 *
		 * @param bool     $remove_date_filters
		 * @param WP_Query $query
		 * @param WP_Post  $series_parent
		 */
		return apply_filters( 'tribe_events_pro_all_events_view_remove_date_filters',
			$remove_date_filters,
			$this->query,
			$this->parent_event
		);
	}
}
