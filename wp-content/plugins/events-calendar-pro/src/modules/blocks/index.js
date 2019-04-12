/**
 * External Dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal Dependencies
 */
import recurrence from '@moderntribe/events-pro/blocks/recurrence';
import recurrenceRule from '@moderntribe/events-pro/blocks/recurrence-rule';
import recurrenceException from '@moderntribe/events-pro/blocks/recurrence-exception';
import recurrenceDescription from '@moderntribe/events-pro/blocks/recurrence-description';
import RelatedEvents from '@moderntribe/events-pro/blocks/related-events';
import { addAdditionalFields } from '@moderntribe/events-pro/blocks/additional-fields/utils';
import { initStore } from '@moderntribe/events-pro/data';

const blocks = addAdditionalFields( [
	recurrence,
	recurrenceRule,
	recurrenceException,
	recurrenceDescription,
	RelatedEvents,
] );

blocks.forEach( block => {
	const blockName = `tribe/${ block.id }`;
	registerBlockType( blockName, block );
} );

// Initialize AFTER blocks are registered
// to avoid plugin shown as available in reducer
// but not having block available for use
initStore();

export default blocks;
