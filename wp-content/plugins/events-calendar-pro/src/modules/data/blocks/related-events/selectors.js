/**
 * External dependencies
 */
import { createSelector } from 'reselect';
import { constants } from '@moderntribe/common/data/plugins';

export const getRelatedEventsBlock = ( state ) => state[ constants.EVENTS_PRO_PLUGIN ].blocks.relatedEvents;

export const getTitle = createSelector(
	[ getRelatedEventsBlock ],
	( relatedEvents ) => relatedEvents.title,
);

export const getDisplayImages = createSelector(
	[ getRelatedEventsBlock ],
	( relatedEvents ) => relatedEvents.displayImages,
);
