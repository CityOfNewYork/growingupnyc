/**
 * External dependencies
 */
import { put, select, call } from 'redux-saga/effects';

/**
 * Internal dependencies
 */
import * as constants from '@moderntribe/events-pro/data/blocks/constants';
import * as recurringConstants from '@moderntribe/events-pro/data/blocks/recurring/constants';
import { moment as momentUtil, time as timeUtil } from '@moderntribe/common/utils';
import { blocks } from '@moderntribe/events/data';

const {
	KEY_TYPE,
	KEY_ALL_DAY,
	KEY_MULTI_DAY,
	KEY_START_TIME,
	KEY_END_TIME,
	KEY_START_TIME_INPUT,
	KEY_END_TIME_INPUT,
	KEY_START_DATE,
	KEY_START_DATE_INPUT,
	KEY_START_DATE_OBJ,
	KEY_END_DATE,
	KEY_END_DATE_INPUT,
	KEY_END_DATE_OBJ,
	KEY_LIMIT,
	KEY_LIMIT_DATE_INPUT,
	KEY_LIMIT_DATE_OBJ,
	KEY_LIMIT_TYPE,
	KEY_BETWEEN,
	KEY_DAYS,
	KEY_WEEK,
	KEY_DAY,
	KEY_MONTH,
	KEY_TIMEZONE,
	KEY_MULTI_DAY_SPAN,
} = constants;

const {
	toMoment,
	toDate,
	toDatabaseDate,
	toDatabaseTime,
	toTime,
	TIME_FORMAT,
} = momentUtil;

const {
	MINUTE_IN_SECONDS,
	HALF_HOUR_IN_SECONDS,
	HOUR_IN_SECONDS,
	DAY_IN_SECONDS,
	TIME_FORMAT_HH_MM,
	toSeconds,
	fromSeconds,
} = timeUtil;

export function* handleAddition( { actions } ) {
	const start = yield select( blocks.datetime.selectors.getStart );
	const end = yield select( blocks.datetime.selectors.getEnd );
	const allDay = yield select( blocks.datetime.selectors.getAllDay );
	const multiDay = yield select( blocks.datetime.selectors.getMultiDay );
	const timezone = yield select( blocks.datetime.selectors.getTimeZone );

	const startMoment = yield call( toMoment, start );
	const endMoment = yield call( toMoment, end );

	const startMomentDate = yield call( [ startMoment, 'date' ] );
	const startWeekNum = yield call( [ Math, 'ceil' ], startMomentDate / 7 );
	const startWeek = recurringConstants.WEEK_NUM_MAPPING_TO_WEEKS_OF_THE_MONTH[ startWeekNum ];
	const startWeekday = yield call( [ startMoment, 'isoWeekday' ] );
	/* startMonth is zero-indexed, January is 0, December is 11 */
	const startMonth = yield call( [ startMoment, 'month' ] );

	const startDate = yield call( toDatabaseDate, startMoment );
	const startTime = yield call( toDatabaseTime, startMoment );
	const endDate = yield call( toDatabaseDate, endMoment );
	const endTime = yield call( toDatabaseTime, endMoment );

	const startDateInput = yield call( toDate, startMoment );
	const startDateObj = new Date( startDateInput );
	const endDateInput = yield call( toDate, endMoment );
	const endDateObj = new Date( endDateInput );

	const startTimeInput = yield call( toTime, startMoment );
	const endTimeInput = yield call( toTime, endMoment );

	yield put( actions.add( {
		[ KEY_TYPE ]: recurringConstants.SINGLE,
		[ KEY_ALL_DAY ]: allDay,
		[ KEY_MULTI_DAY ]: multiDay,
		[ KEY_START_DATE ]: startDate,
		[ KEY_START_DATE_INPUT ]: startDateInput,
		[ KEY_START_DATE_OBJ ]: startDateObj,
		[ KEY_START_TIME ]: startTime,
		[ KEY_START_TIME_INPUT ]: startTimeInput,
		[ KEY_END_DATE ]: endDate,
		[ KEY_END_DATE_INPUT ]: endDateInput,
		[ KEY_END_DATE_OBJ ]: endDateObj,
		[ KEY_END_TIME ]: endTime,
		[ KEY_END_TIME_INPUT ]: endTimeInput,
		[ KEY_BETWEEN ]: 1,
		[ KEY_LIMIT_TYPE ]: recurringConstants.COUNT,
		[ KEY_LIMIT ]: 7,
		[ KEY_LIMIT_DATE_INPUT ]: endDateInput,
		[ KEY_LIMIT_DATE_OBJ ]: endDateObj,
		[ KEY_DAYS ]: [ startWeekday ],
		[ KEY_WEEK ]: startWeek,
		[ KEY_DAY ]: startWeekday,
		/* KEY_MONTH is one-indexed, January is 1, December is 12 */
		[ KEY_MONTH ]: [ startMonth + 1 ],
		[ KEY_TIMEZONE ]: timezone,
		[ KEY_MULTI_DAY_SPAN ]: recurringConstants.NEXT_DAY,
	} ) );
}

export function* handleTimeChange( { actions, selectors }, action, key ) {
	const payloadTime = action.payload[ key ];
	const isAllDay = payloadTime === 'all-day';
	const isMultiDay = yield select( selectors.getMultiDay, action );

	if ( isAllDay ) {
		yield put(
			actions.sync( action.index, {
				[ KEY_ALL_DAY ]: isAllDay,
				[ KEY_START_TIME ]: '00:00:00',
				[ KEY_END_TIME ]: '23:59:59',
			} )
		);
	} else if ( ! isMultiDay ) {
		const isStartTime = key === KEY_START_TIME;
		const isEndTime = key === KEY_END_TIME;

		const startTime = isStartTime
			? payloadTime
			: yield select( selectors.getStartTimeNoSeconds, action );

		const endTime = isEndTime
			? payloadTime
			: yield select( selectors.getEndTimeNoSeconds, action );

		// This put needs to be here to prevent incorrect time formats when 'adjusting'
		// as it will not adjust in all cases
		yield put(
			actions.sync( action.index, {
				[ KEY_ALL_DAY ]: isAllDay,
				[ key ]: `${ payloadTime }:00`,
			} )
		);

		isStartTime
			? yield call( preventEndTimeBeforeStartTime, { actions }, { startTime, endTime }, action )
			: yield call( preventStartTimeAfterEndTime, { actions }, { startTime, endTime }, action );
	} else {
		yield put(
			actions.sync( action.index, {
				[ KEY_ALL_DAY ]: isAllDay,
				[ key ]: `${ payloadTime }:00`,
			} )
		);
	}

	yield call( handleTimeInput, { actions, selectors }, action, key );
}

export function* handleTimeInput( { actions, selectors }, action, key ) {
	const payloadTime = action.payload[ key ];
	const isAllDay = payloadTime === 'all-day';

	let startTimeMoment, endTimeMoment;

	if ( isAllDay ) {
		startTimeMoment = yield call( toMoment, '00:00', TIME_FORMAT, false );
		endTimeMoment = yield call( toMoment, '23:59', TIME_FORMAT, false );
	} else {
		const startTime = yield select( selectors.getStartTimeNoSeconds, action );
		const endTime = yield select( selectors.getEndTimeNoSeconds, action );
		startTimeMoment = yield call( toMoment, startTime, TIME_FORMAT, false );
		endTimeMoment = yield call( toMoment, endTime, TIME_FORMAT, false );
	}

	const startTimeInput = yield call( toTime, startTimeMoment );
	const endTimeInput = yield call( toTime, endTimeMoment );

	yield put(
		actions.sync( action.index, {
			[ KEY_START_TIME_INPUT ]: startTimeInput,
			[ KEY_END_TIME_INPUT ]: endTimeInput,
		} )
	);
}

export function* handleMultiDayChange( { actions, selectors }, action, key ) {
	const isMultiDay = action.payload[ key ];

	if ( ! isMultiDay ) {
		const startTime = yield select( selectors.getStartTimeNoSeconds, action );
		const endTime = yield select( selectors.getEndTimeNoSeconds, action );

		yield call( preventEndTimeBeforeStartTime, { actions }, { startTime, endTime }, action );
		yield call( handleTimeInput, { actions, selectors }, action, key );
	}
}

/**
 * Prevents end time from being before start time.
 * Should only prevent when not a multi-day event.
 *
 * @export
 * @param {Object} { actions } Actions for syncing
 * @param {Object} { startTime, endTime } Start and end time
 * @param {Object} action Action received
 */
export function* preventEndTimeBeforeStartTime( { actions }, { startTime, endTime }, action ) {
	let startTimeSeconds = yield call( toSeconds, startTime, TIME_FORMAT_HH_MM );
	let endTimeSeconds = yield call( toSeconds, endTime, TIME_FORMAT_HH_MM );

	// If end time is earlier than start time, fix time
	if ( endTimeSeconds <= startTimeSeconds ) {
		// If there is less than half an hour left in the day, roll back one hour
		if ( startTimeSeconds + HALF_HOUR_IN_SECONDS >= DAY_IN_SECONDS ) {
			startTimeSeconds -= HOUR_IN_SECONDS;
		}

		endTimeSeconds = startTimeSeconds + HALF_HOUR_IN_SECONDS;

		const adjustedStartTime = yield call( fromSeconds, startTimeSeconds, TIME_FORMAT_HH_MM );
		const adjustedEndTime = yield call( fromSeconds, endTimeSeconds, TIME_FORMAT_HH_MM );

		yield put(
			actions.sync( action.index, {
				[ KEY_START_TIME ]: `${ adjustedStartTime }:00`,
				[ KEY_END_TIME ]: `${ adjustedEndTime }:00`,
			} )
		);
	}
}

/**
 * Prevents start time from appearing ahead of end time.
 * Should only prevent when not a multi-day event.
 *
 * @export
 * @param {Object} { actions } Actions for syncing
 * @param {Object} { startTime, endTime } Start and end time
 * @param {Object} action Action received
 */
export function* preventStartTimeAfterEndTime( { actions }, { startTime, endTime }, action ) {
	let startTimeSeconds = yield call( toSeconds, startTime, TIME_FORMAT_HH_MM );
	let endTimeSeconds = yield call( toSeconds, endTime, TIME_FORMAT_HH_MM );

	if ( startTimeSeconds >= endTimeSeconds ) {
		startTimeSeconds = Math.max( endTimeSeconds - HALF_HOUR_IN_SECONDS, 0 );
		endTimeSeconds = Math.max( startTimeSeconds + MINUTE_IN_SECONDS, endTimeSeconds );

		const adjustedStartTime = yield call( fromSeconds, startTimeSeconds, TIME_FORMAT_HH_MM );
		const adjustedEndTime = yield call( fromSeconds, endTimeSeconds, TIME_FORMAT_HH_MM );

		yield put(
			actions.sync( action.index, {
				[ KEY_START_TIME ]: `${ adjustedStartTime }:00`,
				[ KEY_END_TIME ]: `${ adjustedEndTime }:00`,
			} )
		);
	}
}

export function* handleWeekChange( { actions, selectors }, action, key ) {
	const payloadWeek = action.payload[ key ];
	const weekWasNull = ! ( yield select( selectors.getWeek, action ) );

	if ( payloadWeek && weekWasNull ) {
		yield put(
			actions.sync( action.index, {
				[ key ]: payloadWeek,
				[ KEY_DAY ]: 1,
			} )
		);
	}
}

export function* handleLimitTypeChange( { actions }, action, key ) {
	const value = action.payload[ key ];
	const isDate = value === recurringConstants.DATE;
	const isCount = value === recurringConstants.COUNT;

	if ( isDate ) {
		const start = yield select( blocks.datetime.selectors.getStart );
		const startMoment = yield call( toMoment, start );
		const startDate = yield call( toDatabaseDate, startMoment );
		yield put(
			actions.sync( action.index, {
				[ constants.KEY_LIMIT ]: startDate,
			} )
		);
	} else if ( isCount ) {
		yield put(
			actions.sync( action.index, {
				[ constants.KEY_LIMIT ]: 1,
			} )
		);
	} else {
		// Never ending
		yield put(
			actions.sync( action.index, {
				[ constants.KEY_LIMIT ]: null,
			} )
		);
	}
}

export function* handleTimezoneChange( { actions }, action, key ) {
	yield put(
		actions.sync( action.index, {
			[ constants.KEY_TIMEZONE ]: action.payload[ key ],
		} )
	);
}
