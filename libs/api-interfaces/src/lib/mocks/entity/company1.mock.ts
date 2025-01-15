/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import { CompanyDto } from '../../dtos';
import { address1Mock } from '../address';
import { user1Mock } from './user1.mock';
import { farmer1Mock } from './farmer1.mock';

export const company1Mock: CompanyDto = {
    id: '0de044f0-bc57-495f-94c1-12ddb4fd05a1',
    name: 'Company1',
    address: address1Mock,
    employees: [user1Mock],
    farmers: [farmer1Mock]
}
