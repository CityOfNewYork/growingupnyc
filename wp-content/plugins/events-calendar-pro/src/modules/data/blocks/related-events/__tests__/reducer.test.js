/**
 * Internal dependencies
 */
import { actions } from '@moderntribe/events-pro/data/blocks/related-events';
import reducer, { DEFAULT_STATE } from '@moderntribe/events-pro/data/blocks/related-events/reducer';

describe( '[STORE] - Related Events reducer', () => {
	it( 'Should return the default state', () => {
		expect( reducer( undefined, {} ) ).toEqual( DEFAULT_STATE );
	} );

	it( 'Should set the title value', () => {
		expect( reducer( DEFAULT_STATE, actions.setTitle( 'Related Events' ) ) ).toMatchSnapshot();
	} );

	it( 'Should set the display images value', () => {
		expect( reducer( DEFAULT_STATE, actions.setDisplayImages( true ) ) ).toMatchSnapshot();
	} );

} );
