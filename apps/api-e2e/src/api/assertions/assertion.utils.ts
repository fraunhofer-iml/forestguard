import { HttpStatus } from '@nestjs/common';

export function ensureException(err, message: string) {
  expect(err.response.data.status).toBe(HttpStatus.BAD_REQUEST);
  expect(err.response.data.timestamp).toBeDefined();
  expect(err.response.data.message).toBe(message);
  expect(err.response.data.requestDetails).toBeDefined();
}
