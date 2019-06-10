# aqueduct

[![CircleCI](https://circleci.com/gh/BrunoScheufler/aqueduct.svg?style=svg)](https://circleci.com/gh/BrunoScheufler/aqueduct)

> A cloud-native GraphQL-powered gateway service for the infrastructure of the future!

## description

aqueduct is a scalable service for bundling, monitoring and securing GraphQL services by utilizing remote schema-stitching, functioning as a gateway. While it's admittedly minimal currently, aqueduct will get integrations for logging, metrics and more in the near future, to be used in large, distributed setups.

## getting started

**Warning**: As this is a Node.js-based application, consider setting `NODE_ENV` to `production` to be sure all security & performance-relevant options are enabled!

Generally speaking, you are able to deploy aqueduct in almost every setup you can imagine, whether it's through Docker Compose, Kubernetes or just bare-metal. In any scenario, you'd start by pulling the official Docker image from Docker Hub (`docker pull brunoscheufler/aqueduct:latest`).

Whichever way you deploy aqueduct, the yaml-based configuration is pretty straightforward and can be set using a simple config file mount to the container's config path (defaults to `/config/aqueduct.yaml`, can be changed using the `AQUEDUCT_CONFIG_PATH` environment variable).

Example config:

```yaml
# Put your endpoints to be schema-stitched below
endpoints:
  - cms:
    endpoint: https://api.graphcms.com/simple/v1/swapi
    passHeaders:
      - authorization
```

### aqueduct configuration

All options below are used to configure aqueduct on a service level. If you want more fine-grained options for each endpoint, scroll down to the endpoint configuration. Available aqueduct options are

| name                     | type        | required | default           | description                                                                                                           | env variable                      |
| ------------------------ | ----------- | -------- | ----------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| endpoints                | EndpointMap | true     | n/a               | An object of endpoints to stitch                                                                                      | n/a                               |
| path                     | string      | false    | `/`               | aqueduct GraphQL endpoint path                                                                                        | `AQUEDUCT_PATH`                   |
| port                     | number      | false    | `4000`            | aqueduct port                                                                                                         | `AQUEDUCT_PORT`                   |
| launchDelay              | number      | false    | n/a               | if set, aqueduct will wait the specified amount of ms                                                                 | `AQUEDUCT_LAUNCH_DELAY`           |
| jwtSecret                | string      | false    | n/a               | if set, aqueduct will verify Authorization headers for a valid JWT (warning: this can interfere with endpoints)       | `AQUEDUCT_JWT_SECRET`             |
| enablePlayground         | boolean     | false    | n/a               | if set, the default graphql-playground site will be available on the aqueduct endpoint, regardless of the environment | `AQUEDUCT_ENABLE_PLAYGROUND`      |
| helmet                   | object      | false    | n/a               | if set, the object will be used to configure the Helmet middleware                                                    | n/a                               |
| disablePreflightRequests | boolean     | false    | n/a               | if set, CORS preflight requests will be blocked                                                                       | `AQUEDUCT_DISABLE_CORS_PREFLIGHT` |
| preflightSettings        | object      | false    | `{ origin: '*' }` | if set, these options will be used to configure the CORS middleware for preflight requests                            | n/a                               |
| engineApiKey             | string      | false    | n/a               | if set, this key will be used to report metrics to Apollo Engine                                                      | `AQUEDUCT_ENGINE_KEY`             |
| cors                     | object      | false    | `{ origin: '*' }` | if set, these options will be used to configure the CORS middleware                                                   | n/a                               |
| retrySchemaStitchOnError | boolean     | false    | n/a               | if set, aqueduct will attempt to retry introspecting the endpoint after a failure                                     | n/a                               |
| retryTimeout             | number      | false    | n/a               | number of ms to wait before attempting to retry                                                                       | n/a                               |
| retryAttempts            | number      | false    | 5                 | number of attempts to try before failing                                                                              | n/a                               |

### endpoint configuration

Endpoints are configured in a Map with the key acting as the endpoint name and endpoint-specific configuration options added in the value object. Available options are

| name                     | type     | required | default | description                                                                    |
| ------------------------ | -------- | -------- | ------- | ------------------------------------------------------------------------------ |
| endpoint                 | string   | true     | n/a     | The GraphQL service endpoint URL you want to stitch                            |
| passHeaders              | string[] | false    | n/a     | Headers from the original request to reuse for future requests to this service |
| retrySchemaStitchOnError | boolean  | false    | n/a     | Same as in aqueduct config                                                     |
| retryTimeout             | number   | false    | n/a     | Same as in aqueduct config                                                     |
| retryAttempts            | number   | false    | n/a     | Same as in aqueduct config                                                     |

> Note: Headers are only passed in the user requests, not for introspection use. If your target service requires authentication for introspecting the schema, this won't work unfortunately

## known bugs

- Errors from stitched services might be displayed strangely, this behaviour originates from a known [bug](https://github.com/apollographql/graphql-tools/issues/743) in [graphql-tools](https://github.com/apollographql/graphql-tools)
