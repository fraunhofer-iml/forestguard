/*
 * Copyright Fraunhofer Institute for Material Flow and Logistics
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * For details on the licensing terms, see the LICENSE file.
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { parsePrismaSchema } from './prismaSchemaParser';

const snakeToCamelCase = (str: string) => {
  const cleanStr = str.replace(/"/g, '');
  return cleanStr.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

type TableData = Record<string, any>;
type FieldType = 'String' | 'Int' | 'Float' | 'Boolean' | 'DateTime' | 'Json';

// Load model types from Prisma schema
const modelTypes = parsePrismaSchema('../prisma/schema.prisma');

const convertValue = (value: string | null, type: FieldType): any => {
  if (value === null) return null;

  switch (type) {
    case 'Boolean':
      return value === 't';
    case 'Int':
      return parseInt(value, 10);
    case 'Float':
      return parseFloat(value);
    case 'DateTime':
      // Convert to ISO-8601 string
      return new Date(value).toISOString();
    case 'Json':
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    case 'String':
    default:
      return value;
  }
};

async function convertPostgresDumpToJsons(inputFile: string, outputDir: string) {
  const fileStream = fs.createReadStream(inputFile);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let currentTableName: string | null = null;
  let columns: string[] = [];
  let isDataSelection = false;
  const tableData: Record<string, TableData[]> = {};

  for await (const line of rl) {
    const copyMatch = line.match(/^COPY public\."(.+?)" \((.+?)\) FROM stdin;$/);
    if (copyMatch) {
      currentTableName = copyMatch[1];
      columns = copyMatch[2].split(',').map((col) => col.trim());
      tableData[currentTableName] = [];
      isDataSelection = true;
      continue;
    }

    if (line.startsWith('\\.')) {
      isDataSelection = false;
      currentTableName = null;
      continue;
    }

    if (isDataSelection && currentTableName && line.trim() !== '') {
      const data = line.split('\t').map((col) => {
        const value = col.trim();
        return value === '\\N' ? null : value.replace(/\\"/g, '"');
      });

      const row: TableData = {};
      columns.forEach((column, index) => {
        const camelCaseColumn = snakeToCamelCase(column);
        const fieldType = modelTypes[currentTableName as keyof typeof modelTypes]?.[camelCaseColumn] || 'String';
        row[camelCaseColumn] = convertValue(data[index], fieldType);
      });
      tableData[currentTableName].push(row);
    }
  }

  for (const tableName in tableData) {
    const jsonFileName = `${tableName}.json`;
    const jsonFilePath = path.join(outputDir, jsonFileName);
    fs.writeFileSync(jsonFilePath, JSON.stringify(tableData[tableName], null, 2));
    console.log(`Converted ${tableName} to ${jsonFileName}`);
  }
}

const inputFile = 'forest_guard.dump';
const outputDir = 'data';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

convertPostgresDumpToJsons(inputFile, outputDir).catch((error) => {
  console.error('Error converting dump to JSON:', error);
});
