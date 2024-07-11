import { config } from 'dotenv'
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

config({
  path: '.env.development',
}) // injects the env.development file into process.env with dotenv

const createJestConfig = nextJest({
  dir: '.', // The root directory with the next.config.js file to jest load
})

const jestConfig: Config = {
  moduleDirectories: ['node_modules', '<rootDir>/src'],
}

export default createJestConfig(jestConfig)
