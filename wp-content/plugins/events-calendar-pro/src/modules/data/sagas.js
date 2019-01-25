/**
 * External dependencies
 */
import { store } from '@moderntribe/common/store';

/**
 * Internal dependencies
 */
import * as recurring from '@moderntribe/events-pro/data/blocks/recurring';
import * as exception from '@moderntribe/events-pro/data/blocks/exception';
import * as additionalFields from '@moderntribe/events-pro/data/blocks/additional-fields';
import syncer from '@moderntribe/events-pro/data/shared/sync';
import queueStatus from '@moderntribe/events-pro/data/status/sagas';

export default () => [
	syncer,
	queueStatus,
	recurring.sagas,
	exception.sagas,
	additionalFields.sagas,
].forEach( sagas => store.run( sagas ) );

