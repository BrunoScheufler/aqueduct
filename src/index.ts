import { ApolloServer } from 'apollo-server-express';
import { mergeSchemas } from 'graphql-tools';
import express from 'express';
import jwt from 'express-jwt';
import helmet from 'helmet';
import cors from 'cors';

import {
  createRemoteSchema,
  isDev,
  handleError,
  registerErrorHandlers,
  wait
} from './util';
import { getConfig } from './config';
import { IContext } from './types';

registerErrorHandlers();
const config = getConfig();

(async () => {
  if (!config.endpoints) {
    throw new Error('Missing endpoint list');
  }

  const app = express();

  // Configure helmet
  const helmetOptions = config.helmet;
  app.use(helmet(helmetOptions));

  // Add JWT validation
  const jwtSecret = process.env.AQUEDUCT_JWT_SECRET || config.jwtSecret;
  if (jwtSecret) {
    app.use(jwt({ secret: jwtSecret }));
  }

  // Allow preflight requests unless explicitly disabled
  const disablePreflight =
    config.disablePreflightRequests === true ||
    process.env.AQUEDUCT_DISABLE_CORS_PREFLIGHT === 'true';

  // Handle preflight requests
  if (!disablePreflight) {
    const preflightSettings = config.preflightSettings || { origin: '*' };
    app.options('*', cors(preflightSettings));
  }

  // Handle launch delay
  const launchDelay =
    parseInt(process.env.AQUEDUCT_LAUNCH_DELAY!) || config.launchDelay;
  if (typeof launchDelay !== 'undefined' && !isNaN(launchDelay)) {
    await wait(launchDelay);
  }

  try {
    // retrieve endpoints from config and stitch together remote schemas
    const endpoints = { ...config.endpoints };
    const schema = mergeSchemas({
      schemas: await Promise.all(
        Object.keys(endpoints).map(e => {
          const options = {
            ...endpoints[e],
            retryOnError:
              endpoints[e].retrySchemaStitchOnError ||
              config.retrySchemaStitchOnError,
            retryTimeout: endpoints[e].retryTimeout || config.retryTimeout
          };
          return createRemoteSchema(options);
        })
      )
    });

    // retrieve Apollo Engine api key
    const engineApiKey = process.env.AQUEDUCT_ENGINE_KEY || config.engineApiKey;

    // toggle graphql-playground
    const enablePlayground =
      process.env.AQUEDUCT_ENABLE_PLAYGROUND === 'true' ||
      config.enablePlayground;

    // create and launch server
    const server = new ApolloServer({
      schema,
      cacheControl: true,
      context: ({ req, res }: IContext) => ({ req, res }),
      debug: isDev,
      playground: isDev || enablePlayground,
      tracing: true,
      engine: engineApiKey ? { apiKey: engineApiKey } : false,
      introspection: isDev || enablePlayground
    });

    // Configure and set defaults for cors middleware and graphql endpoint
    const corsOptions = config.cors || { origin: '*' };
    const path = process.env.AQUEDUCT_PATH || config.path || '/';

    server.applyMiddleware({ app, cors: corsOptions, path });

    const serverPort =
      parseInt(process.env.AQUEDUCT_PORT!) || config.port || 4000;

    const address = `http://localhost:${serverPort}${path || ''}`;
    app.listen(serverPort, () =>
      console.log(`Aqueduct server is running at ${address}`)
    );
  } catch (err) {
    handleError(err);
  }
})();
