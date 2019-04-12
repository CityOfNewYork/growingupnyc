/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import * as types from './types';

export const DEFAULT_STATE = {
	title: __( 'Related Events', 'tribe-events-calendar-pro' ),
	displayImages: true,
};

export default ( state = DEFAULT_STATE, action ) => {
	switch ( action.type ) {
		case types.SET_RELATED_EVENTS_TITLE:
			return {
				...state,
				title: action.payload.title,
			};
		case types.SET_RELATED_EVENTS_DISPLAY_IMAGES:
			return {
				...state,
				displayImages: action.payload.displayImages,
			};
		default:
			return state;
	}
};
