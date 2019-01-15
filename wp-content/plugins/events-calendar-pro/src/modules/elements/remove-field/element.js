/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Trash } from '@moderntribe/events-pro/icons';
import './style.pcss';

const RemoveField = ( { onClick } ) => (
	<button
		className="tribe-editor__events-pro__remove-field"
		onClick={ onClick }
		type="button"
	>
		<Trash />
	</button>
);

RemoveField.propTypes = {
	onClick: PropTypes.func.isRequired,
};

export default RemoveField;
