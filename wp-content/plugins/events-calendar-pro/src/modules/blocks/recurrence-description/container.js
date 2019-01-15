/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { compose } from 'redux';
import { select as wpSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { withStore } from '@moderntribe/common/hoc';
import {
	blocks,
} from '@moderntribe/events/data';
import * as recurring from '@moderntribe/events-pro/data/blocks/recurring';
import EventDescriptionBlock from './template';

/**
 * Module Code
 */

const mapStateToProps = state => ( {
	hasRules: recurring.selectors.hasRules( state ),
	isEditable: blocks.datetime.selectors.isEditable( state ),
	slug: wpSelect( 'core/editor' ).getCurrentPostAttribute( 'slug' ) || '',
	link: wpSelect( 'core/editor' ).getCurrentPostAttribute( 'link' ) || '',
} );

const mergeProps = ( stateProps, dispatchProps, ownProps ) => ( {
	...stateProps,
	...dispatchProps,
	...ownProps,
	url: stateProps.link.replace(
		new RegExp( `${ stateProps.slug }\/.*\/?$` ), `${ stateProps.slug }/all`
	)
} );

export default compose(
	withStore(),
	connect( mapStateToProps, null, mergeProps )
)( EventDescriptionBlock );
