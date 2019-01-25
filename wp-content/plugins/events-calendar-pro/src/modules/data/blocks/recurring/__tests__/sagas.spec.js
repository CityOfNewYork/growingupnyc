/**
 * External dependencies
 */
import { takeEvery, put, select, call } from 'redux-saga/effects';
import { keys } from 'lodash';

/**
 * Internal Dependencies
 */
import { constants } from '@moderntribe/events-pro/data/blocks';
import * as recurring from '@moderntribe/events-pro/data/blocks/recurring';
import * as ui from '@moderntribe/events-pro/data/ui';
import * as selectors from '../selectors';
import watchers, * as sagas from '../sagas';
import * as shared from '@moderntribe/events-pro/data/shared/sagas';
import { blocks } from '@moderntribe/events/data';

describe( 'recurring sagas', () => {
	describe( 'watchers', () => {
		it( 'should watch actions', () => {
			const gen = watchers();
			expect( gen.next().value ).toEqual(
				takeEvery( [ recurring.types.REMOVE_RULE ], sagas.handleRuleRemoval )
			);
			expect( gen.next().value ).toEqual(
				takeEvery( [ recurring.types.ADD_RULE_FIELD ], shared.handleAddition, sagas.sagaArgs )
			);
			expect( gen.next().value ).toEqual(
				takeEvery( [ recurring.types.EDIT_RULE ], sagas.handleRuleEdit )
			);
			expect( gen.next().value ).toEqual(
				takeEvery( [ blocks.datetime.types.SET_TIME_ZONE ], sagas.syncRules )
			);
			expect( gen.next().done ).toEqual( true );
		} );
	} );
	describe( 'handleRuleRemoval', () => {
		it( 'should not hide exception panel', () => {
			const gen = sagas.handleRuleRemoval();
			expect( gen.next().value ).toEqual(
				select( recurring.selectors.getRules )
			);
			expect( gen.next( [{ id: 'uniqid' }] ).done ).toEqual( true );
		} );
		it( 'should hide exception panel', () => {
			const gen = sagas.handleRuleRemoval();
			expect( gen.next().value ).toEqual(
				select( recurring.selectors.getRules )
			);
			expect( gen.next( [] ).value ).toEqual(
				put( ui.actions.hideRulePanel() )
			);
			expect( gen.next().done ).toEqual( true );
		} );
	} );
	describe( 'handleRuleEdit', () => {
		it( 'should not sync', () => {
			const gen = sagas.handleRuleEdit( { sync: true } );
			gen.next().value;
			expect( gen.next().done ).toBeTruthy();
		} );

		describe( 'edit flows', () => {
			let action, payload;

			beforeEach( () => {
				payload = {};
				action = { payload, index: 0 };
			} );

			it( 'should handle start time', () => {
				payload[ constants.KEY_START_TIME ] = '12:00:00';
				const gen = sagas.handleRuleEdit( action );

				expect( gen.next().value ).toEqual(
					call( keys, action.payload )
				);

				expect( gen.next( [ constants.KEY_START_TIME ] ).value ).toEqual(
					call( shared.handleTimeChange, sagas.sagaArgs, action, constants.KEY_START_TIME )
				);

				expect( gen.next().done ).toBeTruthy();
			} );
			it( 'should handle end time', () => {
				payload[ constants.KEY_END_TIME ] = '12:00:00';
				const gen = sagas.handleRuleEdit( action );

				expect( gen.next().value ).toEqual(
					call( keys, action.payload )
				);

				expect( gen.next( [ constants.KEY_END_TIME ] ).value ).toEqual(
					call( shared.handleTimeChange, sagas.sagaArgs, action, constants.KEY_END_TIME )
				);

				expect( gen.next().done ).toBeTruthy();
			} );
			it( 'should handle multi day', () => {
				payload[ constants.KEY_MULTI_DAY ] = false;
				const gen = sagas.handleRuleEdit( action );

				expect( gen.next().value ).toEqual(
					call( keys, action.payload )
				);

				expect( gen.next( [ constants.KEY_MULTI_DAY ] ).value ).toEqual(
					call( shared.handleMultiDayChange, sagas.sagaArgs, action, constants.KEY_MULTI_DAY )
				);

				expect( gen.next().done ).toBeTruthy();
			} );
			it( 'should handle week', () => {
				payload[ constants.KEY_WEEK ] = [ 1, 2, 3 ];
				const gen = sagas.handleRuleEdit( action );

				expect( gen.next().value ).toEqual(
					call( keys, action.payload )
				);

				expect( gen.next( [ constants.KEY_WEEK ] ).value ).toEqual(
					call( shared.handleWeekChange, sagas.sagaArgs, action, constants.KEY_WEEK )
				);

				expect( gen.next().done ).toBeTruthy();
			} );
			it( 'should handle limit type', () => {
				payload[ constants.KEY_LIMIT_TYPE ] = 'count';
				const gen = sagas.handleRuleEdit( action );

				expect( gen.next().value ).toEqual(
					call( keys, action.payload )
				);

				expect( gen.next( [ constants.KEY_LIMIT_TYPE ] ).value ).toEqual(
					call( shared.handleLimitTypeChange, sagas.sagaArgs, action, constants.KEY_LIMIT_TYPE )
				);

				expect( gen.next().done ).toBeTruthy();
			} );
		} );
	} );

	describe( 'syncRules', () => {
		let action, exceptions;
		beforeEach( () => {
			action = {
				payload: {
					timeZone: 'UTC+1',
				},
				type: blocks.datetime.types.SET_TIME_ZONE,
			};
			exceptions = [
				{},
				{},
				{},
			];
		} );
		it( 'should sync all exceptions', () => {
			const gen = sagas.syncRules( action );

			expect( gen.next().value ).toEqual(
				select( selectors.getRules )
			);

			expect( gen.next( exceptions ).value ).toEqual(
				call( shared.handleTimezoneChange, sagas.sagaArgs, { index: 0, ...action }, 'timeZone' )
			);
			expect( gen.next().value ).toEqual(
				call( shared.handleTimezoneChange, sagas.sagaArgs, { index: 1, ...action }, 'timeZone' )
			);
			expect( gen.next().value ).toEqual(
				call( shared.handleTimezoneChange, sagas.sagaArgs, { index: 2, ...action }, 'timeZone' )
			);

			expect( gen.next().done ).toBeTruthy();
		} );
	} );
} );
