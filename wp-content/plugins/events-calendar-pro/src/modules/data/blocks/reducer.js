/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import recurring from '@moderntribe/events-pro/data/blocks/recurring/reducer';
import exception from '@moderntribe/events-pro/data/blocks/exception/reducer';
import additionalFields from '@moderntribe/events-pro/data/blocks/additional-fields';
import relatedEvents from '@moderntribe/events-pro/data/blocks/related-events';

export default combineReducers( {
	recurring,
	exception,
	additionalFields,
	relatedEvents,
} );
