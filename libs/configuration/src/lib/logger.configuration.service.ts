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

import { ConsoleLogger } from '@nestjs/common';

export class ForestGuardLogger extends ConsoleLogger {
  constructor() {
    super();
  }
  /**
   * Write a 'log' level log.
   */
  override log(message: any, context?: string) {
    super.log(this.createLogObject(message, 'LOG', '', context));
  }

  /**
   * Write a 'fatal' level log.
   */
  override fatal(message: any, stack?: string, context?: string) {
    super.fatal(this.createLogObject(message, 'FATAL', stack, context));
  }

  /**
   * Write an 'error' level log.
   */
  override error(message: any, stack?: string, context?: string) {
    super.error(this.createLogObject(message, 'ERROR', stack, context));
  }

  /**
   * Write a 'warn' level log.
   */
  override warn(message: any, context?: string) {
    super.warn(this.createLogObject(message, 'WARN', '', context));
  }

  /**
   * Write a 'debug' level log.
   */
  override debug(message: any, context?: string, ...optionalParams: any[]) {
    super.debug(this.createLogObject(message, 'DEBUG', '', context));
  }

  /**
   * Write a 'verbose' level log.
   */
  override verbose(message: any, context?: string) {
    super.verbose(this.createLogObject(message, 'VERBOSE', '', context));
  }
  private createLogObject(message: any, logLevel: string, stack?: string, context?: string) {
    return {
      timestamp: new Date().toISOString(),
      loggerName: 'ForestGuard-Logger',
      threadName: context,
      level: logLevel,
      message: message,
      stackTrace: stack,
    };
  }
}
