/**
 * External Dependencies
 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';
import { controls } from '@moderntribe/events/blocks';

/*
 * Internal Dependencies
 */
import { Recurrence } from '@moderntribe/events-pro/icons';

const { EventDateTimeControls } = controls;

const DEFAULT_DESCRIPTION = __( 'Recurring Event', 'tribe-events-calendar-pro' );

export default class RecurrenceDescription extends PureComponent {
	static propTypes = {
		attributes: PropTypes.shape( {
			description: PropTypes.string,
		} ),
		setAttributes: PropTypes.func,
		hasRules: PropTypes.bool.isRequired,
		url: PropTypes.string.isRequired,
		isEditable: PropTypes.bool.isRequired,
	}

	constructor( props, context ) {
		super( props, context );

		this.input = React.createRef();

		this.state = {
			isEditing: false,
			description: props.attributes.description || DEFAULT_DESCRIPTION,
		};
	}

	handleClick = () => this.setState(
		{ isEditing: true },
		() => this.input.current.focus()
	)

	handleChange = e => this.setState( { description: e.target.value } )
	handleBlur = () => this.setState(
		{ isEditing: false },
		() => this.props.setAttributes( { description: this.state.description } )
	)

	render() {
		return [
			<EventDateTimeControls />,
			this.props.hasRules && (
				<span className="tribe-editor__events-pro__recurrence-description">
					<Recurrence />

					{
						this.state.isEditing
							? (
								<input
									type="text"
									name="description"
									value={ this.state.description }
									onChange={ this.handleChange }
									onBlur={ this.handleBlur }
									ref={ this.input }
									disabled={ ! this.props.isEditable }
								/>
							)
							: (
								<button
									type="button"
									onClick={ this.handleClick }
									disabled={ ! this.props.isEditable }
								>
									{ this.state.description }
								</button>
							)
					}

					<a href={ this.props.url } target="__blank">{ __( 'see all', 'tribe-events-calendar-pro' ) }</a>
				</span>
			),
		];
	}
}
