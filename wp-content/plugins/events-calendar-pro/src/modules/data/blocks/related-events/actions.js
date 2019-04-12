/**
 * Internal dependencies
 */
import * as types from './types';

export const setTitle = ( title ) => ( {
	type: types.SET_RELATED_EVENTS_TITLE,
	payload: {
		title,
	},
} );

export const setDisplayImages = ( displayImages ) => ( {
	type: types.SET_RELATED_EVENTS_DISPLAY_IMAGES,
	payload: {
		displayImages,
	},
} );

export const setInitialState = ( payload ) => ( {
	type: types.SET_RELATED_EVENTS_INITIAL_STATE,
	payload,
} );
