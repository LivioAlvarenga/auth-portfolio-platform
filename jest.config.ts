import { config } from 'dotenv'
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

config({
  path: ['.env.development', '.env'],
}) // injects the env.development file into process.env with dotenv

const createJestConfig = nextJest({
  dir: '.', // The root directory with the next.config.js file to jest load
})

const jestConfig: Config = {
  moduleDirectories: ['node_modules', '<rootDir>/src'], // An array of directory names to be searched recursively up from the requiring module's location
  testTimeout: 60000, // The default timeout of a test in milliseconds
  bail: true, // Stop running tests after `n` failures
  testMatch: ['<rootDir>/src/tests/**/*.test.ts'], // The glob patterns Jest uses to detect test files
}

export default createJestConfig(jestConfig)
