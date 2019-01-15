/**
 * External dependencies
 */
import { connect } from 'react-redux';
import { compose } from 'redux';

/**
 * Internal dependencies
 */
import SettingsTemplate from './template';
import { withStore } from '@moderntribe/common/hoc';
import { globals } from '@moderntribe/common/utils';

/**
 * @todo get data from a selector
 */
const getSettingsLink = () => {
	return globals.pro().additional_fields_tab || '';
};

const mapStateToProps = () => ( {
	settingsLink: getSettingsLink(),
} );

export default compose(
	withStore(),
	connect( mapStateToProps ),
)( SettingsTemplate );
