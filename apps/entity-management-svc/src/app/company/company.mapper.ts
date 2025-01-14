/*
 * Copyright 2025 Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AmqpException } from '@forest-guard/amqp';
import { AddressDto, CompanyDto, PlotOfLandDto, ProofDto, UserDto, UserOrFarmerDto } from '@forest-guard/api-interfaces';
import { HttpStatus } from '@nestjs/common';
import { Address, Proof } from '@prisma/client';
import { CompanyWithRelations, PlotOfLandWithRelations, UserWithRelations } from './company.types';

export class CompanyMapper {
  public static mapCompanyPrismaToCompanyDto(company: CompanyWithRelations): CompanyDto {
    if (!company) {
      throw new AmqpException('Company is required', HttpStatus.BAD_REQUEST);
    }

    const { id, name, address, users } = company;

    return {
      id,
      name,
      address: address ? this.mapAddressToDto(address) : address,
      employees: users
        ? users.filter((user: UserWithRelations) => user.role === 'EMPLOYEE').map((user: UserWithRelations) => this.mapEmployeeToDto(user))
        : [],
      farmers: users
        ? users.filter((user: UserWithRelations) => user.role === 'FARMER').map((user: UserWithRelations) => this.mapFarmerToDto(user))
        : [],
    };
  }

  private static mapAddressToDto(address: Address): AddressDto {
    const { id, street, postalCode, city, state, country, additionalInformation } = address;

    return { id, street, postalCode, city, state, country, additionalInformation };
  }

  private static mapEmployeeToDto(user: UserWithRelations): UserDto {
    const { id, employeeId, firstName, lastName, email, mobilePhoneNumber, role } = user;

    return {
      id,
      employeeId,
      firstName,
      lastName,
      email,
      mobilePhoneNumber,
      role,
    };
  }

  private static mapFarmerToDto(user: UserWithRelations): UserOrFarmerDto {
    const { id, employeeId, firstName, lastName, email, mobilePhoneNumber, role, personalId, address, plotsOfLand } = user;

    return {
      id,
      employeeId,
      firstName,
      lastName,
      email,
      mobilePhoneNumber,
      role,
      personalId,
      address: address ? this.mapAddressToDto(address) : null,
      plotsOfLand: plotsOfLand ? plotsOfLand.map((plotOfLand: PlotOfLandWithRelations) => this.mapPlotOfLandToDto(plotOfLand)) : [],
    };
  }

  private static mapPlotOfLandToDto(plot: PlotOfLandWithRelations): PlotOfLandDto {
    const {
      id,
      country,
      region,
      district,
      nationalPlotOfLandId,
      localPlotOfLandId,
      description,
      geoData,
      areaInHA,
      cultivatedWith,
      proofs,
    } = plot;

    return {
      id,
      country,
      region,
      district,
      nationalPlotOfLandId,
      localPlotOfLandId,
      description,
      geoData,
      areaInHA,
      cultivatedWith,
      proofs: proofs ? proofs.map((proof: Proof) => this.mapProofToDto(proof)) : [],
    };
  }

  private static mapProofToDto(proof: Proof): ProofDto {
    const { documentId, type, documentRef, notice } = proof;

    return { documentId, type, documentRef, notice };
  }
}
