/**
 * External dependencies
 */
import { DateTime } from '@moderntribe/events/icons';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import EventException from './container';

/**
 * Module Code
 */

export default {
	id: 'event-pro-recurrence-exception',
	title: __( 'Exception', 'tribe-events-calendar-pro' ),
	description: __(
		'Add exceptions to your event.',
		'tribe-events-calendar-pro',
	),
	icon: <DateTime />,
	category: 'tribe-events',
	keywords: [ 'event', 'events-gutenberg', 'tribe' ],

	parent: [ 'tribe/event-pro-recurrence' ],

	supports: {
		html: false,
	},

	edit: EventException,

	save( props ) {
		return null;
	},
};
