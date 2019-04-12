/**
 * External dependencies
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TimePicker } from '@moderntribe/common/elements';
import LabeledRow from '@moderntribe/events-pro/elements/labeled-row/element';
import MultiDayCheckbox from '@moderntribe/events-pro/elements/multi-day-checkbox/element';
import { time } from '@moderntribe/common/utils';
import './style.pcss';

const FromTimeRangePicker = ( {
	className,
	endTimeInput,
	isAllDay,
	isMultiDay,
	onEndTimeBlur,
	onEndTimeChange,
	onEndTimeClick,
	onMultiDayChange,
	onStartTimeBlur,
	onStartTimeChange,
	onStartTimeClick,
	startTimeInput,
} ) => {
	const getStartTimePickerProps = () => {
		const props = {
			current: startTimeInput,
			onBlur: onStartTimeBlur,
			onChange: onStartTimeChange,
			onClick: onStartTimeClick,
			start: time.START_OF_DAY,
			end: time.END_OF_DAY,
			showAllDay: false,
			allDay: isAllDay,
		};
		return props;
	};

	const getEndTimePickerProps = () => {
		const props = {
			current: endTimeInput,
			onBlur: onEndTimeBlur,
			onChange: onEndTimeChange,
			onClick: onEndTimeClick,
			start: time.START_OF_DAY,
			end: time.END_OF_DAY,
			disabled: isMultiDay,
			showAllDay: false,
			allDay: isAllDay,
		};
		return props;
	};

	return (
		<LabeledRow
			className={ classNames(
				'tribe-editor__from-time-range-picker',
				{ 'tribe-editor__from-time-range-picker--multi-day': isMultiDay },
				className
			) }
			label={ __( 'From', 'tribe-events-calendar-pro' ) }
		>
			<TimePicker { ...getStartTimePickerProps() } />
			{ ! isAllDay && (
				<Fragment>
					<span>{ __( 'to', 'tribe-events-calendar-pro' ) }</span>
					<TimePicker { ...getEndTimePickerProps() } />
				</Fragment>
			) }
			<MultiDayCheckbox
				className="tribe-editor__from-time-range-picker__multi-day-checkbox"
				checked={ isMultiDay }
				onChange={ onMultiDayChange }
			/>
		</LabeledRow>

	);
};

FromTimeRangePicker.propTypes = {
	className: PropTypes.string,
	endTimeInput: PropTypes.string,
	isAllDay: PropTypes.bool,
	isMultiDay: PropTypes.bool,
	onEndTimeBlur: PropTypes.func,
	onEndTimeChange: PropTypes.func,
	onEndTimeClick: PropTypes.func,
	onMultiDayChange: PropTypes.func,
	onStartTimeBlur: PropTypes.func,
	onStartTimeChange: PropTypes.func,
	onStartTimeClick: PropTypes.func,
	startTimeInput: PropTypes.string,
};

export default FromTimeRangePicker;
