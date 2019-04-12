/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { DateTime } from '@moderntribe/events/icons';

/**
 * Internal dependencies
 */
import EventRecurring from './container';

/**
 * Module Code
 */

export default {
	id: 'event-pro-recurrence',
	title: __( 'Recurring', 'tribe-events-calendar-pro' ),
	description: __(
		'Entry for recurrence',
		'tribe-events-calendar-pro'
	),
	icon: <DateTime />,
	category: 'tribe-events',
	keywords: [ 'event', 'events-gutenberg', 'tribe' ],

	parent: [ 'tribe/event-datetime' ],

	supports: {
		html: false,
	},

	attributes: {
		exceptions: {
			type: 'string',
			source: 'meta',
			meta: '_tribe_blocks_recurrence_exclusions',
		},
		rules: {
			type: 'string',
			source: 'meta',
			meta: '_tribe_blocks_recurrence_rules',
		},
	},

	edit: EventRecurring,

	save( props ) {
		return null;
	},
};
