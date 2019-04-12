/* eslint-disable max-len, camelcase */
/**
 * External dependencies
 */
import { __, sprintf, _n } from '@wordpress/i18n';
import { some } from 'lodash';
import { race, take, select, call, put, fork } from 'redux-saga/effects';
import { delay, eventChannel } from 'redux-saga';
import { select as wpSelect, subscribe, dispatch as wpDispatch } from '@wordpress/data';
import 'whatwg-fetch';
import { blocks } from '@moderntribe/events/data';
import { moment as momentUtils, globals } from '@moderntribe/common/utils';

/**
 * Internal dependencies
 */
import * as recurringTypes from '@moderntribe/events-pro/data/blocks/recurring/types';
import { hasRules } from '@moderntribe/events-pro/data/blocks/recurring/selectors';
import * as actions from './actions';
import * as selectors from './selectors';

//
// ─── NOTICES ─────────────────────────────────────────────────────────────────────
//
export const NOTICE_EDITING_SERIES = 'NOTICE_EDITING_SERIES';
export const NOTICE_PROGRESS_ON_SERIES_CREATION_COUNT = 'NOTICE_PROGRESS_ON_SERIES_CREATION_COUNT';
export const NOTICE_PROGRESS_ON_SERIES_CREATION = 'NOTICE_PROGRESS_ON_SERIES_CREATION';
export const NOTICES = {
	[ NOTICE_EDITING_SERIES ]: __( 'You are currently editing all events in a recurring series.', 'tribe-events-calendar-pro' ),
	[ NOTICE_PROGRESS_ON_SERIES_CREATION_COUNT ]: _n( '%d instance', '%d instances', 1, 'tribe-events-calendar-pro' ),
	[ NOTICE_PROGRESS_ON_SERIES_CREATION ]: __( 'of this event have been created through %s.', 'tribe-events-calendar-pro' ),
};

/**
 * Fetches current series queue status
 *
 * @export
 * @returns {Object|Boolean} JSON status or false when no series being edited
 */
export function* fetchStatus() {
	try {
		const payload = new FormData();
		const postId = wpSelect( 'core/editor' ).getCurrentPostId();

		if ( ! postId ) {
			throw 'No post ID';
		}

		yield call( [ payload, 'append' ], 'action', 'gutenberg_events_pro_recurrence_queue' );

		yield call( [ payload, 'append' ], 'recurrence_queue_status_nonce', globals.restNonce().queue_status_nonce ); // eslint-disable-line max-len
		yield call( [ payload, 'append' ], 'post_id', postId );

		const response = yield call( fetch, window.ajaxurl, {
			method: 'POST',
			credentials: 'same-origin',
			body: payload,
		} );

		return yield call( [ response, 'json' ] );
	} catch ( error ) {
		// TODO: Better error handling
		console.error( error );
		return false; // To mark as completed
	}
}

/**
 * Polls series status until series is completed
 *
 * @export
 */
export function* pollUntilSeriesCompleted() {
	// Disable datetime block edits until we know we're not making any series events
	yield put( blocks.datetime.actions.disableEdits() );

	while ( true ) {
		const response = yield call( fetchStatus );
		const isCompleted = response === false || response.done; // If false, no edits being done

		if ( isCompleted ) {

			const payload = response === false ? { done: isCompleted } : response;

			yield put( actions.setSeriesQueueStatus( payload ) );

			const { items_created, last_created_at, done, percentage } = response;

			// Show progress notice
			if ( done && 100 === percentage ) {

				const date = momentUtils.toDate( momentUtils.toMoment( last_created_at ) );

				yield call(
					[ wpDispatch( 'core/notices' ), 'createSuccessNotice' ],
					`${ sprintf( _n( '%d instance', '%d instances', items_created, 'events-gutenberg' ), items_created ) } ${ sprintf( NOTICES[ NOTICE_PROGRESS_ON_SERIES_CREATION ], date ) }`,
					{ id: NOTICE_PROGRESS_ON_SERIES_CREATION, isDismissible: true }
				);
			}
		} else {
			yield put( actions.setSeriesQueueStatus( response ) );

			// Show "still creating" notice. Same NOTICE_PROGRESS_ON_SERIES_CREATION id is used here so that the above "completion" notice replaces this "still working" notice.
			yield call(
				[ wpDispatch( 'core/notices' ), 'createSuccessNotice' ],
				__( 'Recurring event instances are still being created...', 'events-gutenberg' ),
				{ id: NOTICE_PROGRESS_ON_SERIES_CREATION, isDismissible: true }
			);
		}

		if ( yield select( selectors.isCompleted ) ) {
			yield put( blocks.datetime.actions.allowEdits() ); // Allow datetime block to be editable again
			break; // We done
		}

		yield call( delay, 1000 );
	}
}

/**
 * Creates event channel subscribing to WP editor state
 *
 * @returns {Function} Channel
 */
export function createWPEditorChannel() {
	return eventChannel( emit => {
		const editor = wpSelect( 'core/editor' );

		const predicates = [
			() => editor.isSavingPost() && ! editor.isAutosavingPost(),
			editor.isPublishingPost,
		];

		// Returns unsubscribe function
		return subscribe( () => {
			// Only emit when truthy
			if ( some( predicates, fn => fn() ) ) {
				emit( true ); // Emitted value is insignificant here, but cannot be left undefined
			}
		} );
	} );
}

/**
 * Only used to get around redux saga bug when using channels and actions `takes` together
 *
 * @export
 */
export function* actionTaker() {
	yield take( [ recurringTypes.SYNC_RULES_FROM_DB ] );
}

/**
 * Show edit all prompt
 *
 * @export
 */
export function* showEditingAllSeriesPrompt() {
	yield take( [ recurringTypes.SYNC_RULES_FROM_DB ] );
	const isRecurring = yield select( hasRules );
	const isEditingAll = yield call( [ /action=edit/, 'test' ], window.location.search );

	if ( isRecurring && isEditingAll ) {
		// Show editing notice
		yield call(
			[ wpDispatch( 'core/notices' ), 'createSuccessNotice' ],
			NOTICES[ NOTICE_EDITING_SERIES ],
			{ id: NOTICE_EDITING_SERIES, isDismissible: false }
		);
	}
}

/**
 * Poll on actions or channel emit
 *
 * @export
 */
export default function* watchers() {
	yield fork( showEditingAllSeriesPrompt );

	const channel = yield call( createWPEditorChannel );

	while ( true ) {
		yield race( [
			take( channel ),
			call( actionTaker ),
		] );
		yield call( pollUntilSeriesCompleted );
	}
}
