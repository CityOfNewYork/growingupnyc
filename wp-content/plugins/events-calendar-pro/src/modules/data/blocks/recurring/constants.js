/**
 * External dependencies
 */
import { invert } from 'lodash';
import { __ } from '@wordpress/i18n';

//
// ─── RECURRENCE TYPES ───────────────────────────────────────────────────────────
//

export const DAILY = 'daily';
export const WEEKLY = 'weekly';
export const MONTHLY = 'monthly';
export const YEARLY = 'yearly';
export const SINGLE = 'single';

export const DAILY_LABEL = __( 'Day', 'tribe-events-calendar-pro' );
export const WEEKLY_LABEL = __( 'Week', 'tribe-events-calendar-pro' );
export const MONTHLY_LABEL = __( 'Month', 'tribe-events-calendar-pro' );
export const YEARLY_LABEL = __( 'Year', 'tribe-events-calendar-pro' );

export const DAILY_LABEL_PLURAL = __( 'Days', 'tribe-events-calendar-pro' );
export const WEEKLY_LABEL_PLURAL = __( 'Weeks', 'tribe-events-calendar-pro' );
export const MONTHLY_LABEL_PLURAL = __( 'Months', 'tribe-events-calendar-pro' );
export const YEARLY_LABEL_PLURAL = __( 'Years', 'tribe-events-calendar-pro' );

export const SINGLE_LABEL = __( 'Single Recurrence', 'tribe-events-calendar-pro' );

export const RECURRENCE_TYPES = [ DAILY, WEEKLY, MONTHLY, YEARLY, SINGLE ];

//
// ─── SERIES END TYPES ───────────────────────────────────────────────────────────
//

export const ON = 'on';
export const AFTER = 'after';
export const NEVER = 'never';

export const ON_LABEL = __( 'On', 'tribe-events-calendar-pro' );
export const AFTER_LABEL = __( 'After', 'tribe-events-calendar-pro' );
export const NEVER_LABEL = __( 'Never', 'tribe-events-calendar-pro' );

export const DATE = 'date';
export const COUNT = 'count';

//
// ─── DAYS OF THE WEEK ───────────────────────────────────────────────────────────
//

export const SUNDAY = 'sunday';
export const MONDAY = 'monday';
export const TUESDAY = 'tuesday';
export const WEDNESDAY = 'wednesday';
export const THURSDAY = 'thursday';
export const FRIDAY = 'friday';
export const SATURDAY = 'saturday';

export const SUNDAY_LABEL = __( 'Sunday', 'tribe-events-calendar-pro' );
export const MONDAY_LABEL = __( 'Monday', 'tribe-events-calendar-pro' );
export const TUESDAY_LABEL = __( 'Tuesday', 'tribe-events-calendar-pro' );
export const WEDNESDAY_LABEL = __( 'Wednesday', 'tribe-events-calendar-pro' );
export const THURSDAY_LABEL = __( 'Thursday', 'tribe-events-calendar-pro' );
export const FRIDAY_LABEL = __( 'Friday', 'tribe-events-calendar-pro' );
export const SATURDAY_LABEL = __( 'Saturday', 'tribe-events-calendar-pro' );

export const SUNDAY_ABBR = __( 'S', 'tribe-events-calendar-pro' );
export const MONDAY_ABBR = __( 'M', 'tribe-events-calendar-pro' );
export const TUESDAY_ABBR = __( 'T', 'tribe-events-calendar-pro' );
export const WEDNESDAY_ABBR = __( 'W', 'tribe-events-calendar-pro' );
export const THURSDAY_ABBR = __( 'T', 'tribe-events-calendar-pro' );
export const FRIDAY_ABBR = __( 'F', 'tribe-events-calendar-pro' );
export const SATURDAY_ABBR = __( 'S', 'tribe-events-calendar-pro' );

export const SUNDAY_CHECKED = 'sundayChecked';
export const MONDAY_CHECKED = 'mondayChecked';
export const TUESDAY_CHECKED = 'tuesdayChecked';
export const WEDNESDAY_CHECKED = 'wednesdayChecked';
export const THURSDAY_CHECKED = 'thursdayChecked';
export const FRIDAY_CHECKED = 'fridayChecked';
export const SATURDAY_CHECKED = 'saturdayChecked';

export const DAYS_OF_THE_WEEK_PROP_KEYS = [
	SUNDAY_CHECKED,
	MONDAY_CHECKED,
	TUESDAY_CHECKED,
	WEDNESDAY_CHECKED,
	THURSDAY_CHECKED,
	FRIDAY_CHECKED,
	SATURDAY_CHECKED,
];

export const DAYS_OF_THE_WEEK_MAPPING_TO_STATE = {
	[ MONDAY ]: 1,
	[ TUESDAY ]: 2,
	[ WEDNESDAY ]: 3,
	[ THURSDAY ]: 4,
	[ FRIDAY ]: 5,
	[ SATURDAY ]: 6,
	[ SUNDAY ]: 7,
};

export const DAYS_OF_THE_WEEK_MAPPING_FROM_STATE = invert( DAYS_OF_THE_WEEK_MAPPING_TO_STATE );

export const DAYS_OF_THE_WEEK_PROP_KEY_MAPPING_FROM_STATE = {
	1: MONDAY_CHECKED,
	2: TUESDAY_CHECKED,
	3: WEDNESDAY_CHECKED,
	4: THURSDAY_CHECKED,
	5: FRIDAY_CHECKED,
	6: SATURDAY_CHECKED,
	7: SUNDAY_CHECKED,
};

//
// ─── DAYS OF THE MONTH ──────────────────────────────────────────────────────────
//

// returns an array from 1 - 31
export const DAYS_OF_THE_MONTH = Array( 31 ).fill().map( ( _, index ) => index + 1 );

export const DAY = 'day';
export const DAY_LABEL = __( 'Day', 'tribe-events-calendar-pro' );

//
// ─── WEEKS OF THE MONTH ─────────────────────────────────────────────────────────
//

export const FIRST = 'first';
export const SECOND = 'second';
export const THIRD = 'third';
export const FOURTH = 'fourth';
export const FIFTH = 'fifth';
export const LAST = 'last';

export const FIRST_LABEL = __( 'First', 'tribe-events-calendar-pro' );
export const SECOND_LABEL = __( 'Second', 'tribe-events-calendar-pro' );
export const THIRD_LABEL = __( 'Third', 'tribe-events-calendar-pro' );
export const FOURTH_LABEL = __( 'Fourth', 'tribe-events-calendar-pro' );
export const FIFTH_LABEL = __( 'Fifth', 'tribe-events-calendar-pro' );
export const LAST_LABEL = __( 'Last', 'tribe-events-calendar-pro' );

export const WEEKS_OF_THE_MONTH = [ FIRST, SECOND, THIRD, FOURTH, FIFTH, LAST ];
export const WEEK_NUM_MAPPING_TO_WEEKS_OF_THE_MONTH = {
	1: FIRST,
	2: SECOND,
	3: THIRD,
	4: FOURTH,
	5: FIFTH,
};

//
// ─── MONTHS OF THE YEAR ─────────────────────────────────────────────────────────
//

export const JANUARY = 'january';
export const FEBRUARY = 'february';
export const MARCH = 'march';
export const APRIL = 'april';
export const MAY = 'may';
export const JUNE = 'june';
export const JULY = 'july';
export const AUGUST = 'august';
export const SEPTEMBER = 'september';
export const OCTOBER = 'october';
export const NOVEMBER = 'november';
export const DECEMBER = 'december';

export const JANUARY_LABEL = __( 'January', 'tribe-events-calendar-pro' );
export const FEBRUARY_LABEL = __( 'February', 'tribe-events-calendar-pro' );
export const MARCH_LABEL = __( 'March', 'tribe-events-calendar-pro' );
export const APRIL_LABEL = __( 'April', 'tribe-events-calendar-pro' );
export const MAY_LABEL = __( 'May', 'tribe-events-calendar-pro' );
export const JUNE_LABEL = __( 'June', 'tribe-events-calendar-pro' );
export const JULY_LABEL = __( 'July', 'tribe-events-calendar-pro' );
export const AUGUST_LABEL = __( 'August', 'tribe-events-calendar-pro' );
export const SEPTEMBER_LABEL = __( 'September', 'tribe-events-calendar-pro' );
export const OCTOBER_LABEL = __( 'October', 'tribe-events-calendar-pro' );
export const NOVEMBER_LABEL = __( 'November', 'tribe-events-calendar-pro' );
export const DECEMBER_LABEL = __( 'December', 'tribe-events-calendar-pro' );

export const JANUARY_ABBR = __( 'Jan', 'tribe-events-calendar-pro' );
export const FEBRUARY_ABBR = __( 'Feb', 'tribe-events-calendar-pro' );
export const MARCH_ABBR = __( 'Mar', 'tribe-events-calendar-pro' );
export const APRIL_ABBR = __( 'Apr', 'tribe-events-calendar-pro' );
export const MAY_ABBR = __( 'May', 'tribe-events-calendar-pro' );
export const JUNE_ABBR = __( 'Jun', 'tribe-events-calendar-pro' );
export const JULY_ABBR = __( 'Jul', 'tribe-events-calendar-pro' );
export const AUGUST_ABBR = __( 'Aug', 'tribe-events-calendar-pro' );
export const SEPTEMBER_ABBR = __( 'Sep', 'tribe-events-calendar-pro' );
export const OCTOBER_ABBR = __( 'Oct', 'tribe-events-calendar-pro' );
export const NOVEMBER_ABBR = __( 'Nov', 'tribe-events-calendar-pro' );
export const DECEMBER_ABBR = __( 'Dec', 'tribe-events-calendar-pro' );

export const MONTHS_OF_THE_YEAR_MAPPING_TO_STATE = {
	[ JANUARY ]: 1,
	[ FEBRUARY ]: 2,
	[ MARCH ]: 3,
	[ APRIL ]: 4,
	[ MAY ]: 5,
	[ JUNE ]: 6,
	[ JULY ]: 7,
	[ AUGUST ]: 8,
	[ SEPTEMBER ]: 9,
	[ OCTOBER ]: 10,
	[ NOVEMBER ]: 11,
	[ DECEMBER ]: 12,
};

export const MONTHS_OF_THE_YEAR_MAPPING_FROM_STATE = invert( MONTHS_OF_THE_YEAR_MAPPING_TO_STATE );

//
// ─── RECURRING MULTI DAY ────────────────────────────────────────────────────────
//

export const NEXT_DAY = 'next_day';
export const SECOND_DAY = 'second_day';
export const THIRD_DAY = 'third_day';
export const FOURTH_DAY = 'fourth_day';
export const FIFTH_DAY = 'fifth_day';
export const SIXTH_DAY = 'sixth_day';
export const SEVENTH_DAY = 'seventh_day';

export const NEXT_DAY_LABEL = __( 'Next day', 'tribe-events-calendar-pro' );
export const SECOND_DAY_LABEL = __( '2nd day', 'tribe-events-calendar-pro' );
export const THIRD_DAY_LABEL = __( '3rd day', 'tribe-events-calendar-pro' );
export const FOURTH_DAY_LABEL = __( '4th day', 'tribe-events-calendar-pro' );
export const FIFTH_DAY_LABEL = __( '5th day', 'tribe-events-calendar-pro' );
export const SIXTH_DAY_LABEL = __( '6th day', 'tribe-events-calendar-pro' );
export const SEVENTH_DAY_LABEL = __( '7th day', 'tribe-events-calendar-pro' );
