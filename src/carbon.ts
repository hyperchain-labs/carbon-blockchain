/* © Hyperchain Labs LLC
 * All rights reserved
 * SPDX-License-Identifier: Apache-2.0
 */

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Carbon {

    @Property()
    public value: string;

}
