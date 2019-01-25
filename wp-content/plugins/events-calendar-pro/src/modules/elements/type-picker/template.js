/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';
import { __ } from '@wordpress/i18n';
import { proptypes } from '@moderntribe/common/data/plugins';

/**
 * Internal dependencies
 */
import FrequencySelect from './frequency-select/element';
import { Select } from '@moderntribe/common/elements';
import LabeledRow from '@moderntribe/events-pro/elements/labeled-row/element';
import { constants } from '@moderntribe/events-pro/data/blocks';
import { constants as recurringConstants } from '@moderntribe/events-pro/data/blocks/recurring';
import './style.pcss';

const TypePicker = ( {
	blockType,
	className,
	index,
	onChange,
	options,
	rowLabel,
	selected,
	isPlural
} ) => {

	const getFrequencySelect = () => (
		selected &&
			selected.value !== recurringConstants.SINGLE &&
			(
				<FrequencySelect
					className="tribe-editor__type-picker__frequency-select"
					blockType={ blockType }
					index={ index }
					selected={ selected }
				/>
			)
	);

	const getOptionLabel = ( option ) => {
		return isPlural && option.label_plural ? option.label_plural : option.label;
	}

	return (
		<LabeledRow
			className={ classNames( 'tribe-editor__type-picker', className ) }
			label={ rowLabel }
		>
			{ getFrequencySelect() }
			<Select
				className="tribe-editor__type-picker__type-select"
				backspaceRemovesValue={ false }
				value={ selected }
				isSearchable={ false }
				options={ options }
				onChange={ onChange }
				getOptionLabel={ getOptionLabel }
			/>
		</LabeledRow>
	);
};

TypePicker.defaultProps = {
	onChange: noop,
	options: [],
};

TypePicker.propTypes = {
	blockType: PropTypes.oneOf( constants.BLOCK_TYPES ),
	className: PropTypes.string,
	index: PropTypes.number,
	onChange: PropTypes.func,
	options: proptypes.ReactSelectOptions,
	selected: proptypes.ReactSelectOption.isRequired,
	rowLabel: PropTypes.string,
};

export default TypePicker;
