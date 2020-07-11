'use strict';

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['tests/**/*.ts', 'tests/**/*.js'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    testEnvironment: 'node',
    preset: 'ts-jest',
};
