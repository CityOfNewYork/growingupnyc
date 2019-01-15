/**
 * External dependencies
 */
import { sprintf } from '@wordpress/i18n';
import { some, noop } from 'lodash';
import { race, take, select, call, put, fork } from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';
import { select as wpSelect, subscribe, dispatch as wpDispatch } from '@wordpress/data';
import 'whatwg-fetch';
import { blocks } from '@moderntribe/events/data';
import { moment as momentUtils } from '@moderntribe/common/utils';

/**
 * Internal dependencies
 */
import * as recurringTypes from '@moderntribe/events-pro/data/blocks/recurring/types';
import { hasRules } from '@moderntribe/events-pro/data/blocks/recurring/selectors';
import * as actions from '../actions';
import * as selectors from '../selectors';
import watchers, * as sagas from '../sagas';

function mock() {
	return {
		select: jest.fn( () => ( {
			isSavingPost: noop,
			isPublishingPost: noop,
			getCurrentPostId: jest.fn( () => 1 ),
		} ) ),
		subscribe: jest.fn( () => noop ),
		dispatch: jest.fn( () => ( {
			removeNotice: noop,
			createSuccessNotice: noop,
		} ) ),
	};
}

jest.mock( '@wordpress/data', () => mock() );

describe( 'Status sagas', () => {
	describe( 'fetchStatus', () => {
		let _FormData, _Response, append, json;

		function FormDataMock() {
			this.append = append;
		}

		function ResponseMock() {
			this.json = json;
		}

		beforeAll( () => {
			_FormData = global.FormData;
			global.FormData = FormDataMock;
			global.Response = ResponseMock;
			global.tribe_js_config = {
				rest: {
					nonce: {
						queue_status_nonce: 'nonce',
					},
				},
			};
			global.ajaxurl = 'https://cool.com';
		} );

		beforeEach( () => {
			append = jest.fn();
			json = jest.fn();
		} );

		afterAll( () => {
			global.FormData = _FormData;
			global.Response = _Response;
			delete global.tribe_js_config;
			delete global.ajaxurl;
		} );

		it( 'should fetch successfully', () => {
			const gen = sagas.fetchStatus();

			expect( gen.next().value ).toMatchSnapshot();
			expect( append.mock.calls ).toMatchSnapshot();
			expect( gen.next().value ).toMatchSnapshot();
			expect( append.mock.calls ).toMatchSnapshot();
			expect( gen.next().value ).toMatchSnapshot();
			expect( append.mock.calls ).toMatchSnapshot();

			expect( gen.next().value ).toEqual(
				call( global.fetch, global.ajaxurl, {
					method: 'POST',
					credentials: 'same-origin',
					body: new FormData(),
				} )
			);

			const response = new Response();
			expect( gen.next( response ).value ).toEqual(
				call( [ response, 'json' ] )
			);
			expect( gen.next().done ).toBeTruthy();
		} );
		it( 'should handle errors', () => {
			const gen = sagas.fetchStatus();
			gen.next().value;
			expect( gen.throw().value ).toEqual( false );
			expect( gen.next().done ).toBeTruthy();
		} );
	} );

	describe( 'pollUntilSeriesCompleted', () => {
		it( 'should poll if not done', () => {
			const gen = sagas.pollUntilSeriesCompleted();

			expect( gen.next().value ).toEqual(
				put( blocks.datetime.actions.disableEdits() )
			);

			expect( gen.next().value ).toEqual(
				call( sagas.fetchStatus )
			);

			const response = { done: false, items_created: 1, last_created_at: '2019-11-07 00:00:00' };
			expect( gen.next( response ).value ).toEqual(
				put( actions.setSeriesQueueStatus( response ) )
			);

			expect( gen.next().value ).toEqual(
				 call(
					[ wpDispatch( 'core/notices' ), 'createSuccessNotice' ],
					`${ sprintf( sagas.NOTICES[ sagas.NOTICE_PROGRESS_ON_SERIES_CREATION_COUNT ], response.items_created ) } ${ sprintf( sagas.NOTICES[ sagas.NOTICE_PROGRESS_ON_SERIES_CREATION ], momentUtils.toDate( momentUtils.toMoment( response.last_created_at ) ) ) }`,
					{ id: sagas.NOTICE_PROGRESS_ON_SERIES_CREATION, isDismissible: true }
				)
			);

			expect( gen.next( false ).value ).toEqual(
				select( selectors.isCompleted )
			);

			expect( gen.next().value ).toEqual(
				call( delay, 1000 )
			);

			expect( gen.next().done ).toBeFalsy();
		} );
		it( 'should exit when done', () => {
			const gen = sagas.pollUntilSeriesCompleted();

			expect( gen.next().value ).toEqual(
				put( blocks.datetime.actions.disableEdits() )
			);

			expect( gen.next().value ).toEqual(
				call( sagas.fetchStatus )
			);

			const response = { done: true, items_created: 3, last_created_at: '2019-11-07 00:00:00' };
			expect( gen.next( response ).value ).toEqual(
				put( actions.setSeriesQueueStatus( response ) )
			);

			expect( gen.next( true ).value ).toEqual(
				select( selectors.isCompleted )
			);

			expect( gen.next( true ).value ).toEqual(
				put( blocks.datetime.actions.allowEdits() )
			);

			expect( gen.next().value ).toEqual(
				call(
					[ wpDispatch( 'core/editor' ), 'removeNotice' ],
					sagas.NOTICE_EDITING_SERIES
				)
			);

			expect( gen.next().done ).toBeTruthy();
		} );
	} );

	describe( 'createWPEditorChannel', () => {
		it( 'should create channel', () => {
			expect( sagas.createWPEditorChannel() ).toMatchSnapshot();
		} );
	} );

	describe( 'actionTaker', () => {
		it( 'just takes actions', () => {
			const gen = sagas.actionTaker();

			expect( gen.next().value ).toEqual(
				take( [ recurringTypes.SYNC_RULES_FROM_DB ] )
			);

			expect( gen.next().done ).toBeTruthy();
		} );
	} );

	describe( 'showEditingAllSeriesPrompt', () => {
		it( 'should show prompt', () => {
			const gen = sagas.showEditingAllSeriesPrompt();

			expect( gen.next().value ).toEqual(
				take( [ recurringTypes.SYNC_RULES_FROM_DB ] )
			);

			expect( gen.next().value ).toEqual(
				select( hasRules )
			);

			expect( gen.next( true ).value ).toEqual(
				call( [ /action=edit/, 'test' ], window.location.search )
			);

			expect( gen.next( true ).value ).toEqual(
				call(
					[ wpDispatch( 'core/notices' ), 'createSuccessNotice' ],
					sagas.NOTICES[ sagas.NOTICE_EDITING_SERIES ],
					{ id: sagas.NOTICE_EDITING_SERIES, isDismissible: false }
				)
			);
		} );
	} );

	describe( 'watchers', () => {
		it( 'should watch for channel or action changes', () => {
			const gen = watchers();

			expect( gen.next().value ).toEqual(
				fork( sagas.showEditingAllSeriesPrompt )
			);

			expect( gen.next().value ).toEqual(
				call( sagas.createWPEditorChannel )
			);

			expect( gen.next( 'Channel' ).value ).toEqual(
				race( [
					take( 'Channel' ),
					call( sagas.actionTaker ),
				] )
			);

			expect( gen.next( 'Channel' ).value ).toEqual(
				call( sagas.pollUntilSeriesCompleted )
			);

			expect( gen.next().done ).toBeFalsy();
		} );
	} );
} );
