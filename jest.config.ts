import type { Config } from "@jest/types"
import { defaults } from "jest-config"
import * as fs from "fs";
import * as path from "path";
import {pathsToModuleNameMapper} from "ts-jest";
const tsconfigData = JSON.parse((fs.readFileSync(path.join(__dirname, "tsconfig.json")).toString()))

const IGNORE_COVERAGE_AND_TESTING_DIRS = ["<rootDir>/node_modules/", "<rootDir>/build/", "<rootDir>/coverage/", "<rootDir>/.next/", "<rootDir>/dist/"]
const config: Config.InitialOptions = {
	...defaults,
	roots: ["./"], // access via <rootDir>
	testTimeout: 5 * 60 * 1000,
	verbose: true,
	// mocks
	clearMocks: true,
	resetMocks: false,
	restoreMocks: true,
	resetModules: false,
	automock: false,
	// coverage
	collectCoverage: false,
	coverageDirectory: "coverage",
	collectCoverageFrom: ["**/*.{js,ts}"],
	coveragePathIgnorePatterns: IGNORE_COVERAGE_AND_TESTING_DIRS,
	coverageReporters: ["json"],
	moduleDirectories: ["node_modules"],
	moduleFileExtensions: ["js", "ts", "json"],
	testEnvironment: "node",
	setupFilesAfterEnv: [],
	testMatch: ["**/*.spec.ts"],
	testPathIgnorePatterns: IGNORE_COVERAGE_AND_TESTING_DIRS,
	transform: {
		"^.+\\.(t|j)s$": "ts-jest"
	},
	moduleNameMapper: {
		...pathsToModuleNameMapper(tsconfigData.compilerOptions.paths, { prefix: '<rootDir>/src' } )
	}
}

export default config

