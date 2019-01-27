import { IHelmetConfiguration } from 'helmet';
import { CorsOptions } from 'cors';
import { Request, Response } from 'express';

export interface IRemoteSchemaStitchOptions {
  retrySchemaStitchOnError?: boolean;
  retryTimeout?: number;
  retryAttempts?: number;
}

export interface IEndpointOptions extends IRemoteSchemaStitchOptions {
  endpoint: string;
  passHeaders?: string[];
}

export interface IEndpointMap {
  [name: string]: IEndpointOptions;
}

export interface IConfig extends IRemoteSchemaStitchOptions {
  endpoints?: IEndpointMap;
  path?: string;
  port?: number;
  launchDelay?: number;
  jwtSecret?: string;
  engineApiKey?: string;
  enablePlayground?: boolean;
  helmet?: IHelmetConfiguration;
  disablePreflightRequests?: boolean;
  preflightSettings?: CorsOptions;
  cors?: CorsOptions;
}

export interface IContext {
  req: Request;
  res: Response;
}
