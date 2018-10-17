import { ApolloServer } from 'apollo-server';
import { mergeSchemas } from 'graphql-tools';
import {
	createRemoteSchema,
	IContext,
	isDev,
	handleError,
	registerErrorHandlers,
	wait
} from './util';
import { getConfig } from './config';

registerErrorHandlers();
const config = getConfig();

(async () => {
	const launchDelay =
		parseInt(process.env.LAUNCH_DELAY!) || config.launchDelay;
	if (!isNaN(launchDelay)) {
		await wait(launchDelay);
	}

	try {
		// retrieve endpoints from config and stitch together remote schemas
		const endpoints = [...config.endpoints];
		const schema = mergeSchemas({
			schemas: await Promise.all(
				endpoints.map(e => createRemoteSchema(e))
			)
		});

		// retrieve Apollo Engine api key
		const engineApiKey =
			process.env.AQUEDUCT_ENGINE_KEY || config.engineApiKey;

		// create and launch server
		const server = new ApolloServer({
			schema,
			cacheControl: true,
			context: ({ req, res }: IContext) => ({ req, res }),
			debug: isDev,
			playground: isDev,
			tracing: true,
			engine: engineApiKey ? { apiKey: engineApiKey } : false
		});

		const serverPort =
			parseInt(process.env.AQUEDUCT_PORT!) || config.port || 4000;

		const info = await server.listen(serverPort);

		console.log(`Aqueduct server is running at ${info.url}`);
	} catch (err) {
		handleError(err);
	}
})();
