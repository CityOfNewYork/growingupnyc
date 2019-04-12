/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Wordpress dependencies
 */
import {
	TextControl,
	PanelBody,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Settings } from '@moderntribe/events-pro/blocks/additional-fields/elements';
import './style.pcss';

const CheckboxSettings = ( props ) => {

	const {
		label,
		listDividerOnChange,
		listDividerValue,
		listEnderOnChange,
		listEnderValue,
	} = props;

	const After = () => (
		<PanelBody title={ __( 'Custom Dividers', 'tribe-events-calendar-pro' ) }>
			<TextControl
				label={ __( 'List divider', 'tribe-events-calendar-pro' ) }
				value={ listDividerValue }
				onChange={ listDividerOnChange }
				className="tribe-editor__additional-fields__divider-settings"
			/>
			<TextControl
				label={ __( 'List ender', 'tribe-events-calendar-pro' ) }
				value={ listEnderValue }
				onChange={ listEnderOnChange }
				className="tribe-editor__additional-fields__divider-settings"
			/>
		</PanelBody>
	);

	return (
		<Settings name={ label } after={ <After /> } />
	);
};

CheckboxSettings.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	listDividerValue: PropTypes.string,
	listDividerOnChange: PropTypes.func,
	listEnderValue: PropTypes.string,
	listEnderOnChange: PropTypes.func,
};

CheckboxSettings.defaultProps = {
	listDividerValue: ', ',
	listEnderValue: __( ' and ', 'tribe-events-calendar-pro' ),
};

export default CheckboxSettings;

