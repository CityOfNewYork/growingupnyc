/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Select, TimePicker } from '@moderntribe/common/elements';
import { time } from '@moderntribe/common/utils';
import LabeledRow from '@moderntribe/events-pro/elements/labeled-row/element';
import { options } from '@moderntribe/events-pro/data/blocks/recurring';
import './style.pcss';

const RecurringToDateTimePicker = ( {
	className,
	endTimeInput,
	isAllDay,
	onEndTimeBlur,
	onEndTimeChange,
	onEndTimeClick,
	onRecurringMultiDayChange,
	recurringMultiDay,
} ) => (
	<LabeledRow
		className={ classNames(
			'tribe-editor__recurring-to-date-time-picker',
			className
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
			showAllDay={ true }
			allDay={ isAllDay }
		/>
		<span>{ __( 'on the', 'tribe-events-calendar-pro' ) }</span>
		<Select
			className="tribe-editor__recurring-to-date-time-picker__select"
			backspaceRemovesValue={ false }
			value={ recurringMultiDay }
			isSearchable={ false }
			options={ options.RECURRING_MULTI_DAY_OPTIONS }
			onChange={ onRecurringMultiDayChange }
		/>
	</LabeledRow>
);

RecurringToDateTimePicker.propTypes = {
	className: PropTypes.string,
	endTimeInput: PropTypes.string,
	isAllDay: PropTypes.bool,
	onEndTimeBlur: PropTypes.func,
	onEndTimeChange: PropTypes.func,
	onEndTimeClick: PropTypes.func,
	onRecurringMultiDayChange: PropTypes.func,
	recurringMultiDay: PropTypes.oneOf( options.RECURRING_MULTI_DAY_OPTIONS ),
};

export default RecurringToDateTimePicker;
