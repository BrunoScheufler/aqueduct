import yaml from 'js-yaml';
import { pathExistsSync, readFileSync } from 'fs-extra';
import path from 'path';
import { IHelmetConfiguration } from 'helmet';
import { CorsOptions } from 'cors';

export interface IConfig {
  helmet?: IHelmetConfiguration;
  jwtSecret?: string;
  disablePreflightRequests?: boolean;
  preflightSettings?: CorsOptions;
  launchDelay?: number;
  endpoints?: string[];
  engineApiKey?: string;
  enablePlayground?: boolean;
  cors?: CorsOptions;
  path?: string;
  port?: number;
}

export const getConfig = (): IConfig => {
  const configPath = path.resolve(
    process.env.AQUEDUCT_CONFIG_PATH || '/config/aqueduct.yaml'
  );

  if (!pathExistsSync(configPath)) {
    throw new Error('Could not find configuration file');
  }

  return yaml.load(readFileSync(configPath, 'utf8'));
};
