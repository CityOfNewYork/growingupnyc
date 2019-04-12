/**
 * Internal dependencies
 */
import { selectors } from '@moderntribe/events-pro/data/blocks/related-events';
import { DEFAULT_STATE } from '../reducers/field';

const { EVENTS_PRO_PLUGIN } = constants;
const state = {
	[ EVENTS_PRO_PLUGIN ]: {
		blocks: {
			relatedEvents: DEFAULT_STATE,
		},
	},
};

describe( '[STORE] - Related Events selectors', () => {
	it( 'Should return the related events block', () => {
		expect( selectors.getRelatedEventsBlock( state ) ).toEqual( DEFAULT_STATE );
	} );

	it( 'Should return the related events block title', () => {
		expect( selectors.getTitle( state ) ).toEqual( DEFAULT_STATE.title );
	} );

	it( 'Should return the related events block display images', () => {
		expect( selectors.getDisplayImages( state ) ).toEqual( DEFAULT_STATE.displayImages );
	} );

} );
