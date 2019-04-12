/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatDate, parseDate } from 'react-day-picker/moment';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TimePicker, DayPickerInput } from '@moderntribe/common/elements';
import LabeledRow from '@moderntribe/events-pro/elements/labeled-row/element';
import { time } from '@moderntribe/common/utils';
import './style.pcss';

const SingleToDateTimePicker = ( {
	className,
	endDate,
	endDateFormat,
	endTimeInput,
	isAllDay,
	onEndTimeBlur,
	onEndDateChange,
	onEndTimeChange,
	onEndTimeClick,
} ) => {
	const endDateObj = new Date( endDate );

	return (
		<LabeledRow
			className={ classNames(
				'tribe-editor__single-to-date-time-picker',
				className,
			) }
			label={ __( 'To', 'tribe-events-calendar-pro' ) }
		>
			<TimePicker
				current={ endTimeInput }
				start={ time.START_OF_DAY }
				end={ time.END_OF_DAY }
				onBlur={ onEndTimeBlur }
				onChange={ onEndTimeChange }
				onClick={ onEndTimeClick }
				allDay={ isAllDay }
			/>
			<span>{ __( 'on', 'tribe-events-calendar-pro' ) }</span>
			<DayPickerInput
				value={ endDate }
				format={ endDateFormat }
				formatDate={ formatDate }
				parseDate={ parseDate }
				dayPickerProps={ {
					modifiers: {
						start: endDateObj,
						end: endDateObj,
					},
				} }
				onDayChange={ onEndDateChange }
			/>
		</LabeledRow>
	);
};

SingleToDateTimePicker.propTypes = {
	className: PropTypes.string,
	endDate: PropTypes.string,
	endDateFormat: PropTypes.string,
	endTimeInput: PropTypes.string,
	isAllDay: PropTypes.bool,
	onEndDateChange: PropTypes.func,
	onEndTimeBlur: PropTypes.func,
	onEndTimeChange: PropTypes.func,
	onEndTimeClick: PropTypes.func,
};

SingleToDateTimePicker.defaultProps = {
	endDateFormat: 'LL',
};

export default SingleToDateTimePicker;
