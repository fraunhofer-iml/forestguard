/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';

type FieldType = 'String' | 'Int' | 'Float' | 'Boolean' | 'DateTime' | 'Json';
type ModelTypes = Record<string, Record<string, FieldType>>;

export function parsePrismaSchema(schemaPath: string = 'schema.prisma'): ModelTypes {
  const fullPath = path.join(__dirname, schemaPath);
  const schema = fs.readFileSync(fullPath, 'utf-8');
  const models: ModelTypes = {};

  let currentModel: string | null = null;
  let currentModelFields: Record<string, FieldType> = {};

  // Process the schema line by line
  const lines = schema.split('\n');
  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines
    if (trimmedLine === '') continue;

    // Check for model definition start
    const modelMatch = line.match(/model\s+(\w+)\s*{/);
    if (modelMatch) {
      // Save previous model if exists
      if (currentModel) {
        models[currentModel] = currentModelFields;
      }

      // Start new model
      currentModel = modelMatch[1];
      currentModelFields = {};
      continue;
    }

    // Check for model definition end
    if (trimmedLine === '}' && currentModel) {
      models[currentModel] = currentModelFields;
      currentModel = null;
      currentModelFields = {};
      continue;
    }

    // Process field definitions if we're inside a model
    if (currentModel) {
      const fieldMatch = line.match(/^\s*(\w+)\s+(\w+)(\?|\[\])?/);
      if (!fieldMatch) continue;

      const [, fieldName, fieldType] = fieldMatch;

      // Skip relation fields
      if (!['String', 'Json', 'DateTime', 'Boolean', 'Int', 'Float'].includes(fieldType)) {
        continue;
      }

      // Map Prisma types to our FieldType
      let mappedType: FieldType = 'String';
      switch (fieldType) {
        case 'Int':
          mappedType = 'Int';
          break;
        case 'Float':
          mappedType = 'Float';
          break;
        case 'Boolean':
          mappedType = 'Boolean';
          break;
        case 'DateTime':
          mappedType = 'DateTime';
          break;
        case 'Json':
          mappedType = 'Json';
          break;
        default:
          mappedType = 'String';
      }

      currentModelFields[fieldName] = mappedType;
    }
  }

  // Save the last model if exists
  if (currentModel) {
    models[currentModel] = currentModelFields;
  }

  return models;
}
