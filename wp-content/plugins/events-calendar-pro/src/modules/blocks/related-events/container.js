/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

/**
 * WordPress dependencies
 */
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { withSaveData, withStore } from '@moderntribe/common/hoc';
import * as actions from '@moderntribe/events-pro/data/blocks/related-events/actions';
import * as selectors from '@moderntribe/events-pro/data/blocks/related-events/selectors';
import RelatedEvents from './template';

/**
 * Module Code
 */
const applyWithSelect = withSelect( ( select, ownProps ) => {
	const tags = select( 'core/editor' ).getEditedPostAttribute( 'tags' );
	const categories = select( 'core/editor' ).getEditedPostAttribute( 'tribe_events_cat' );

	return {
		tags: tags || [],
		categories: categories || [],
	};
} );

const mapStateToProps = ( state ) => ( {
	title: selectors.getTitle( state ),
	displayImages: selectors.getDisplayImages( state ),
} );

const mapDispatchToProps = ( dispatch ) => ( {
	setInitialState: ( props ) => dispatch( actions.setInitialState( props ) ),
	setTitle: ( e ) => dispatch( actions.setTitle( e.target.value ) ),
	onSetDisplayImagesChange: ( checked ) => ( dispatch( actions.setDisplayImages( checked ) ) ),
} );

export default compose(
	withStore(),
	connect(
		mapStateToProps,
		mapDispatchToProps,
	),
	applyWithSelect,
	withSaveData(),
)( RelatedEvents );