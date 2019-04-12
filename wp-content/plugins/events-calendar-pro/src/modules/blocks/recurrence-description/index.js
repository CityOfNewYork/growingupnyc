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
import EventDescription from './container';
import './style.pcss';

/**
 * Module Code
 */

export default {
	id: 'event-pro-recurrence-description',
	title: __( 'Recurring Description', 'tribe-events-calendar-pro' ),
	description: __(
		'Recurrence description',
		'tribe-events-calendar-pro'
	),
	icon: <DateTime />,
	category: 'tribe-events',
	keywords: [ 'event', 'events-gutenberg', 'tribe' ],

	parent: [ 'tribe/event-datetime-content' ],

	supports: {
		html: false,
	},

	attributes: {
		description: {
			type: 'string',
			source: 'meta',
			meta: '_tribe_blocks_recurrence_description',
		},
	},

	edit: EventDescription,

	save( props ) {
		return null;
	},
};
