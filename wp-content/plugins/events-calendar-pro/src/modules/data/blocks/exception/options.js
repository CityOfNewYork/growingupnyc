/**
 * External Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import * as constants from '@moderntribe/events-pro/data/blocks/recurring/constants';

export const EXCEPTION_OCCURRENCE_OPTIONS = [
	{ label: __( 'Daily', 'tribe-events-calendar-pro' ), value: constants.DAILY },
	{ label: __( 'Weekly', 'tribe-events-calendar-pro' ), value: constants.WEEKLY },
	{ label: __( 'Monthly', 'tribe-events-calendar-pro' ), value: constants.MONTHLY },
	{ label: __( 'Yearly', 'tribe-events-calendar-pro' ), value: constants.YEARLY },
	{ label: __( 'Single Exception', 'tribe-events-calendar-pro' ), value: constants.SINGLE },
];
