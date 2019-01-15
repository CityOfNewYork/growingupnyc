/**
 * External dependencies
 */
import reducer from './reducers';

import { actions, constants } from '@moderntribe/common/data/plugins';
import { store } from '@moderntribe/common/store';
import initSagas from './sagas';
import * as blocks from './blocks';
import '@moderntribe/events-pro/data/sagas';

const { EVENTS_PRO_PLUGIN } = constants;

export const initStore = () => {
	const { dispatch, injectReducers } = store;
	initSagas();

	dispatch( actions.addPlugin( EVENTS_PRO_PLUGIN ) );
	injectReducers( { [ EVENTS_PRO_PLUGIN ]: reducer } );
};

export const getStore = () => store;

export { blocks };
