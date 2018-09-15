import { HttpLink } from 'apollo-link-http';
import fetch from 'isomorphic-unfetch';
import { IncomingMessage, ServerResponse } from 'http';
import { makeRemoteExecutableSchema, introspectSchema } from 'graphql-tools';

export interface IContext {
	req: IncomingMessage;
	res: ServerResponse;
}

export const createRemoteSchema = async (uri: string) => {
	const link = new HttpLink({ uri, fetch });
	const schema = await introspectSchema(link);
	return makeRemoteExecutableSchema({ link, schema });
};

export const isDev = process.env.NODE_ENV === 'development';

export const handleError = (err: Error) => {
	console.error(err);
	process.exit(1);
};

export const registerErrorHandlers = () => {
	process.on('uncaughtException', handleError);
	process.on('unhandledRejection', handleError);
	process.on('SIGTERM', () =>
		handleError(new Error('Detected SIGTERM, bye!'))
	);
	process.on('SIGINT', () => handleError(new Error('Detected SIGINT, bye!')));
};
