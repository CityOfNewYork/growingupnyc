/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { compose } from 'redux';

/**
 * Internal dependencies
 */
import FromTimeRangePicker from './template';
import { constants } from '@moderntribe/events-pro/data/blocks';
import {
	actions as recurringActions,
	selectors as recurringSelectors,
} from '@moderntribe/events-pro/data/blocks/recurring';
import {
	actions as exceptionActions,
	selectors as exceptionSelectors,
} from '@moderntribe/events-pro/data/blocks/exception';
import { withStore } from '@moderntribe/common/hoc';
import {
	moment as momentUtil,
	time as timeUtil,
} from '@moderntribe/common/utils';

const { toMoment, toTime24Hr, TIME_FORMAT } = momentUtil;
const { TIME_FORMAT_HH_MM, fromSeconds } = timeUtil;
const {
	KEY_END_TIME,
	KEY_END_TIME_INPUT,
	KEY_MULTI_DAY,
	KEY_START_TIME,
	KEY_START_TIME_INPUT,
} = constants;

const onEndTimeBlur = ( dispatchProps, ownProps, endTimeNoSeconds ) => ( e ) => {
	let endTimeMoment = toMoment( e.target.value, TIME_FORMAT, false );
	if ( ! endTimeMoment.isValid() ) {
		endTimeMoment = toMoment( endTimeNoSeconds, TIME_FORMAT, false );
	}
	const endTime = toTime24Hr( endTimeMoment );
	dispatchProps.editRule( ownProps.index, { [ KEY_END_TIME ]: endTime } );
};

const onStartTimeBlur = ( dispatchProps, ownProps, startTimeNoSeconds ) => ( e ) => {
	let startTimeMoment = toMoment( e.target.value, TIME_FORMAT, false );
	if ( ! startTimeMoment.isValid() ) {
		startTimeMoment = toMoment( startTimeNoSeconds, TIME_FORMAT, false );
	}
	const startTime = toTime24Hr( startTimeMoment );
	dispatchProps.editRule( ownProps.index, { [ KEY_START_TIME ]: startTime } );
};

const onEndTimeChange = ( dispatchProps, ownProps ) => ( e ) => {
	dispatchProps.editRule(
		ownProps.index,
		{ [ KEY_END_TIME_INPUT ]: e.target.value },
	)
};

const onStartTimeChange = ( dispatchProps, ownProps ) => ( e ) => {
	dispatchProps.editRule(
		ownProps.index,
		{ [ KEY_START_TIME_INPUT ]: e.target.value },
	)
};

const onMultiDayChange = ( dispatchProps, ownProps ) => ( e ) => {
	dispatchProps.editRule(
		ownProps.index,
		{ [ KEY_MULTI_DAY ]: e.target.checked },
	);
};

const onEndTimeClick = ( dispatchProps, ownProps ) => ( value, onClose ) => {
	const endTime = value === 'all-day' ? value : fromSeconds( value, TIME_FORMAT_HH_MM );
	dispatchProps.editRule(
		ownProps.index,
		{ [ KEY_END_TIME ]: endTime },
	);
	onClose();
};

const onStartTimeClick = ( dispatchProps, ownProps ) => ( value, onClose ) => {
	const startTime = value === 'all-day' ? value : fromSeconds( value, TIME_FORMAT_HH_MM );
	dispatchProps.editRule(
		ownProps.index,
		{ [ KEY_START_TIME ]: startTime },
	);
	onClose();
};

const mapStateToProps = ( state, ownProps ) => {
	const selectors = ownProps.blockType === constants.RECURRING
		? recurringSelectors
		: exceptionSelectors;

	return {
		endTime: selectors.getEndTimeNoSeconds( state, ownProps ),
		endTimeInput: selectors.getEndTimeInput( state, ownProps ),
		isAllDay: selectors.getAllDay( state, ownProps ),
		isMultiDay: selectors.getMultiDay( state, ownProps ),
		startTime: selectors.getStartTimeNoSeconds( state, ownProps ),
		startTimeInput: selectors.getStartTimeInput( state, ownProps ),
	};
};

const mapDispatchToProps = ( dispatch, ownProps ) => {
	const action = ownProps.blockType === constants.RECURRING
		? recurringActions
		: exceptionActions;

	return {
		editRule: ( index, payload ) => dispatch( action.editRule( index, payload ) ),
	};
};

const mergeProps = ( stateProps, dispatchProps, ownProps ) => {
	const { endTime, startTime, ...restStateProps } = stateProps;

	return {
		...ownProps,
		...restStateProps,
		...dispatchProps,
		onEndTimeBlur: onEndTimeBlur( dispatchProps, ownProps, endTime ),
		onEndTimeChange: onEndTimeChange( dispatchProps, ownProps ),
		onEndTimeClick: onEndTimeClick( dispatchProps, ownProps ),
		onMultiDayChange: onMultiDayChange( dispatchProps, ownProps ),
		onStartTimeBlur: onStartTimeBlur( dispatchProps, ownProps, startTime ),
		onStartTimeChange: onStartTimeChange( dispatchProps, ownProps ),
		onStartTimeClick: onStartTimeClick( dispatchProps, ownProps ),
	};
}

export default compose(
	withStore(),
	connect( mapStateToProps, mapDispatchToProps, mergeProps ),
)( FromTimeRangePicker );
