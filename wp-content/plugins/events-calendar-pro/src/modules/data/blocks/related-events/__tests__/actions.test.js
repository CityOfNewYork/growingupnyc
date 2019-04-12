/**
 * External dependencies
 */
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

/**
 * Internal dependencies
 */
import { actions } from '@moderntribe/events-pro/data/blocks/related-events';

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

describe( '[STORE] - Related Events actions', () => {
	it( 'Should set initial state', () => {
		expect( actions.setInitialState( {} ) ).toMatchSnapshot();
	} );

	it( 'Should set the Related Events title', () => {
		expect( actions.setTitle( 'Related Events' ) ).toMatchSnapshot();
	} );

	it( 'Should set the attendees Display Images', () => {
		expect( actions.setDisplayImages( true ) ).toMatchSnapshot();
	} );

} );
