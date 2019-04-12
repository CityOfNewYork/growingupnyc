/**
 * Internal dependencies
 */
import { types } from '@moderntribe/tickets/data/blocks/related-events';
import { PREFIX_EVENTS_PRO_STORE } from '@moderntribe/events-pro/data/prefix';

describe( '[STORE] - Related Events types', () => {
	it( 'Related Events initial state', () => {
		expect( types.SET_RELATED_EVENTS_INITIAL_STATE ).toBe( `${ PREFIX_EVENTS_PRO_STORE }/SET_RELATED_EVENTS_INITIAL_STATE` );
	} );

	it( 'Should match the types values', () => {
		expect( types.SET_RELATED_EVENTS_TITLE ).toBe( `${ PREFIX_EVENTS_PRO_STORE }/SET_RELATED_EVENTS_TITLE` );
	} );

	it( 'Should match the types values', () => {
		expect( types.SET_RELATED_EVENTS_DISPLAY_IMAGES ).toBe( `${ PREFIX_EVENTS_PRO_STORE }/SET_RELATED_EVENTS_DISPLAY_IMAGES` );
	} );

} );
