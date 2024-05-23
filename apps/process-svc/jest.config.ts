/* eslint-disable */
export default {
  displayName: 'process-svc',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: [['lcov', { projectRoot: __dirname }], 'text', 'text-summary'],
  coverageDirectory: './coverage',
};
