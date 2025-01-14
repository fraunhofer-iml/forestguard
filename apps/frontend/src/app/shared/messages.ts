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

export enum Messages {
  successHarvest = 'Harvest successfully added',
  successCompany = 'Company successfully added',
  successProcessStep = 'Process step added successfully',
  successPlotOfLand = 'Plot of Land successfully added',
  successProof = 'Proof is successfully added',
  successUser = 'User successfully added',
  successFarmer = 'Farmer successfully added',
  successMasterDataImport = 'Data successfully imported',
  successUpdateFarmer = 'Farmer successfully updated',
  error = 'Please fill in all required fields',
  errorCreateHarvest = 'Creation of harvest batches failed.',
  invalidGeoData = 'Invalid JSON format.',
  errorCompany = 'Please add a company before proceeding',
  errorMasterDataImport = 'Invalid File',
  errorUserExists = 'Farmer or Employee with this Identifier already exists',
}
