/**
 * External dependencies
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import AutosizeInput from 'react-input-autosize';
import classNames from 'classnames';
import { isEqual } from 'lodash';

/**
 * WordPress dependencies
 */
import { PanelBody, ToggleControl } from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';
import { __ } from '@wordpress/i18n';
const { select, subscribe } = wp.data;

/**
 * Internal dependencies
 */
import { rest } from '@moderntribe/common/utils/globals';
import { RelatedEvents as RelatedEventsThumb } from '@moderntribe/events-pro/icons';
import './style.pcss';

/**
 * Module Code
 */

const UI = ( props ) => {
	const { isSelected, categories, tags, events, title, displayImages } = props;
	const hasTaxonomy = categories.length || tags.length;
	const hasEvents = events.length;

	const blockTitle = ! ( isSelected || title )
		? renderPlaceholder()
		: renderLabelInput( props );

	return (
		<div key="event-links" className="tribe-editor__block tribe-editor__related-events">
			<h2>{ blockTitle }</h2>
			{ hasTaxonomy && hasEvents
				? <RelatedEventsGrid events={ events } displayImages={ displayImages } />
				: <RelatedEventsWarning /> }
		</div>
	);
}

const placeholder = __( 'Related Events', 'tribe-events-calendar-pro' );

const renderLabelInput = ( { isSelected, isEmpty, title, setTitle } ) => {
	const containerClassNames = classNames( {
		'tribe-editor__related-events__title': true,
		'tribe-editor__related-events__title--selected': isSelected,
	} );

	const inputClassNames = classNames( {
		'tribe-editor__related-events__title-text': true,
		'tribe-editor__related-events__title-text--empty': isEmpty && isSelected,
	} );

	return (
		<div
			key="tribe-events-related-events-label"
			className={ containerClassNames }
		>
			<AutosizeInput
				id="tribe-events-related-events-title"
				className={ inputClassNames }
				value={ title }
				placeholder={ placeholder }
				onChange={ setTitle }
			/>
		</div>
	);
};

const renderPlaceholder = () => {
	const classes = [
		'tribe-editor__related-events__title',
		'tribe-editor__related-events__title--placeholder',
	];

	return (
		<span className={ classNames( classes ) }>
			{ placeholder }
		</span>
	);
};

const RelatedEventsWarning = () => {

	return (
		<div className="tribe-editor__related-events__warning">
			{ __( 'This block displays related events based on the tags and categories you select. Please add tags and categories to display related events, and be sure you have more events for these tags and categories.', 'tribe-events-calendar-pro' ) }
		</div>
	);

}

const RelatedEventsGrid = ( { events, displayImages } ) => {

	return (
		<div className="tribe-editor__related-events__grid">
			{ events.map( ( event, i ) => { return <RelatedEventsGridItem key={ i } displayImages={ displayImages } event={ event } /> } ) }
		</div>
	);

}

const RelatedEventsGridItem = ( { i, displayImages, event } ) => {

	const date = `${ event.start_date } - ${ event.end_date_details.hour}:${ event.end_date_details.minutes }:${ event.end_date_details.seconds }`;

	return (
		<div className="tribe-editor__related-events__grid--item">
			{ displayImages ? <RelatedEventsThumb /> : '' }
			<div className="tribe-editor__related-events__grid--item-details">
				{ <RelatedEventsGridItemTitle title={ event.title } /> }
				{ <RelatedEventsGridItemDetails date={ date } /> }
			</div>
		</div>
	);
}

const RelatedEventsGridItemTitle = ( { title } ) => {

	return (
		<h3 className="tribe-editor__related-events__grid--item-title">{ title }</h3>
	);
}

const RelatedEventsGridItemDetails = ( { date } ) => {

	return (
		<div className="tribe-editor__related-events__grid--item-date">
			{ date }
		</div>
	);
}

const Controls = ( {
	isSelected,
	displayImages,
	onSetDisplayImagesChange,
} ) => (
	isSelected && (
		<InspectorControls key="inspector">
			<PanelBody title={ __( 'Related Events Settings', 'tribe-events-calendar-pro' ) }>
				<ToggleControl
					label={ __( 'Display Images', 'tribe-events-calendar-pro' ) }
					checked={ displayImages }
					onChange={ onSetDisplayImagesChange }
				/>
			</PanelBody>
		</InspectorControls>
	)
);


class RelatedEvents extends PureComponent {

	constructor( props ) {
		super( props );

		// Get initial state
		this.state = {
			tags: select( 'core/editor' ).getEditedPostAttribute( 'tags' ) || [],
			categories: select( 'core/editor' ).getEditedPostAttribute( 'tribe_events_cat' ) || [],
			events: [],
		}

	}

	componentDidMount() {
		// Initial fetch
		const attrs = this.props;
		const hasTaxonomy = attrs.categories.length || attrs.tags.length;

		if ( hasTaxonomy ) {
			this.fetch();
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		const { tags, categories } = this.props;
		if (
			! isEqual( tags, this.state.tags ) ||
			! isEqual( categories, this.state.categories )
		) {
			this.fetch();
		}
	}

	fetch = () => {
		const { tags, categories } = this.props;
		const postId = select( 'core/editor' ).getCurrentPostId();
		var restUrl = `${ rest().url }tribe/events/v1/events?&per_page=3`;

		if ( categories.length ) {
			restUrl = `${ restUrl }&categories=${ categories.join() }`;
		}

		if ( tags.length ) {
			restUrl = `${ restUrl }&tags=${ tags.join() }`;
		}

		fetch( restUrl )
		.then( result => result.json() )
		.then( json => {

			// get the results without the current event
			const events = json.events.filter( e => e.id !== postId );

			const newData = {
				categories,
				tags,
				events,
			};

			this.setState( newData );
		} );
	}

	render() {
		return [
			<UI {...this.props} tags={ this.state.tags } categories={ this.state.categories } events={ this.state.events } />,
			<Controls {...this.props} />,
		]
	}
}

RelatedEvents.propTypes = {
	title: PropTypes.string,
	isSelected: PropTypes.bool,
	isEmpty: PropTypes.bool,
	displayImages: PropTypes.bool,
	onSetDisplayImagesChange: PropTypes.func,
	tags: PropTypes.array,
	categories: PropTypes.array,
	events: PropTypes.array,
};

export default RelatedEvents;