import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';
import { IContext, IEndpointOptions } from './types';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';

export const createRemoteSchema = async (options: IEndpointOptions) => {
  const {
    retryTimeout,
    retryAttempts,
    retrySchemaStitchOnError,
    passHeaders,
    endpoint
  } = options;

  const attempts = retryAttempts || 5;
  const link = new HttpLink({ uri: endpoint, fetch });

  let remoteSchema: GraphQLSchema | null = null;

  // try to introspect remote schema
  for (let i = 0; i < attempts; i++) {
    try {
      remoteSchema = await introspectSchema(link);
    } catch (err) {
      if (!retrySchemaStitchOnError) {
        throw err;
      }
      console.log(
        `Failed to stitch schema, retrying in ${(retryTimeout || 3000) /
          1000} seconds...`
      );
      if (retryTimeout) {
        await wait(retryTimeout);
      }
      continue;
    }
  }

  if (!remoteSchema) {
    throw new Error(
      `Could not stitch remote schema for endpoint '${endpoint}'`
    );
  }

  if (!passHeaders) {
    return makeRemoteExecutableSchema({ link, schema: remoteSchema });
  }

  // build context link and apply headers from original request
  const ContextLink = setContext(
    (request, prev: { graphqlContext: IContext }) => ({
      headers: passHeaders.reduce((prevHeaders: any, rawHeaderName) => {
        const headerName = rawHeaderName.toLowerCase();
        prevHeaders[headerName] = prev.graphqlContext.req.get(headerName);
        return prevHeaders;
      }, {})
    })
  );

  // create executable schema with context
  return makeRemoteExecutableSchema({
    link: ApolloLink.from([ContextLink, link]),
    schema: remoteSchema
  });
};

export const isDev = process.env.NODE_ENV === 'development';

export const handleError = (err: Error) => {
  console.error(err);
  process.exit(1);
};

export const registerErrorHandlers = () => {
  process.on('uncaughtException', handleError);
  process.on('unhandledRejection', handleError);
  process.on('SIGTERM', () => handleError(new Error('Detected SIGTERM, bye!')));
  process.on('SIGINT', () => handleError(new Error('Detected SIGINT, bye!')));
};

export const wait = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });
