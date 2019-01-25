/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { find } from 'lodash';

/**
 * Internal dependencies
 */
import RecurringToDateTimePicker from './template';
import { constants } from '@moderntribe/events-pro/data/blocks';
import {
	actions,
	options,
	selectors,
} from '@moderntribe/events-pro/data/blocks/recurring';
import {
	moment as momentUtil,
	time as timeUtil,
} from '@moderntribe/common/utils';
import { withStore } from '@moderntribe/common/hoc';

const { KEY_END_TIME, KEY_END_TIME_INPUT, KEY_MULTI_DAY_SPAN } = constants;
const { toMoment, toTime24Hr, TIME_FORMAT } = momentUtil;
const { TIME_FORMAT_HH_MM, fromSeconds } = timeUtil;

const getRecurringMultiDay = ( state, ownProps ) => {
	const recurringMultiDay = selectors.getMultiDaySpan( state, ownProps );
	return find(
		options.RECURRING_MULTI_DAY_OPTIONS,
		( option ) => option.value === recurringMultiDay,
	);
};

const onEndTimeBlur = ( dispatch, ownProps, endTimeNoSeconds ) => ( e ) => {
	let endTimeMoment = toMoment( e.target.value, TIME_FORMAT, false );
	if ( ! endTimeMoment.isValid() ) {
		endTimeMoment = toMoment( endTimeNoSeconds, TIME_FORMAT, false );
	}
	const endTime = toTime24Hr( endTimeMoment );
	dispatch( actions.editRule(
		ownProps.index,
		{ [ KEY_END_TIME ]: endTime },
	) );
};

const onEndTimeChange = ( dispatch, ownProps ) => ( e ) => (
	dispatch( actions.editRule(
		ownProps.index,
		{ [ KEY_END_TIME_INPUT ]: e.target.value },
	) )
);

const onEndTimeClick = ( dispatch, ownProps ) => ( value, onClose ) => {
	const endTime = value === 'all-day' ? value : fromSeconds( value, TIME_FORMAT_HH_MM );
	dispatch( actions.editRule(
		ownProps.index,
		{ [ KEY_END_TIME ]: endTime },
	) );
	onClose();
};

const onRecurringMultiDayChange = ( dispatch, ownProps ) => ( selectedOption ) => (
	dispatch( actions.editRule(
		ownProps.index,
		{ [ KEY_MULTI_DAY_SPAN ]: selectedOption.value },
	) )
);

const mapStateToProps = ( state, ownProps ) => ( {
	endTime: selectors.getEndTimeNoSeconds( state, ownProps ),
	endTimeInput: selectors.getEndTimeInput( state, ownProps ),
	isAllDay: selectors.getAllDay( state, ownProps ),
	recurringMultiDay: getRecurringMultiDay( state, ownProps ),
} );

const mapDispatchToProps = ( dispatch, ownProps ) => ( {
	onEndTimeChange: onEndTimeChange( dispatch, ownProps ),
	onEndTimeClick: onEndTimeClick( dispatch, ownProps ),
	onRecurringMultiDayChange: onRecurringMultiDayChange( dispatch, ownProps ),
	dispatch,
} );

const mergeProps = ( stateProps, dispatchProps, ownProps ) => {
	const { endTime, ...restStateProps } = stateProps;
	const { dispatch, ...restDispatchProps } = dispatchProps;

	return {
		...ownProps,
		...restStateProps,
		...restDispatchProps,
		onEndTimeBlur: onEndTimeBlur( dispatch, ownProps, endTime ),
	};
}

export default compose(
	withStore(),
	connect( mapStateToProps, mapDispatchToProps, mergeProps ),
)( RecurringToDateTimePicker );
