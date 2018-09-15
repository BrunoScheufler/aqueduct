import yaml from 'js-yaml';
import { pathExistsSync, readFileSync } from 'fs-extra';
import path from 'path';

export const getConfig = () => {
	const configPath = path.resolve(
		process.env.CONFIG_PATH || '/config/aqueduct.yaml'
	);

	if (!pathExistsSync(configPath)) {
		throw new Error('Could not find configuration file');
	}

	return yaml.load(readFileSync(configPath, 'utf8'));
};
