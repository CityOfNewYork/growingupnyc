/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import RelatedEvents from './container';
import { Sharing } from '@moderntribe/events/icons';

/**
 * Module Code
 */
export default {
	id: 'related-events',
	title: __( 'Related Events', 'tribe-events-calendar-pro' ),
	description: __(
		'Show other events with the same event categories and/or tags.',
		'tribe-events-calendar-pro'
	),
	icon: <Sharing/>,
	category: 'tribe-events',
	keywords: [ 'event', 'events-gutenberg', 'tribe' ],

	supports: {
		html: false,
	},

	attributes: {
		title: {
			type: 'html',
			default: __( 'Related Events', 'tribe-events-calendar-pro' ),
		},
		displayImages: {
			type: 'boolean',
			default: true,
		},
	},

	edit: RelatedEvents,
	save: () => null,
};

