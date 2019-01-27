# aqueduct

> A cloud-native GraphQL-powered gateway service for the infrastructure of the future!

## description

aqueduct is a scalable service for bundling, monitoring and securing GraphQL services by utilizing remote schema-stitching, functioning as a gateway. While it's admittedly minimal currently, aqueduct will get integrations for logging, metrics and more in the near future, to be used in large, distributed setups.

## getting started

**Warning**: As this is a Node.js-based application, consider setting `NODE_ENV` to `production` to be sure all security & performance-relevant options are enabled!

Generally speaking, you are able to deploy aqueduct in almost every setup you can imagine, whether it's through Docker Compose, Kubernetes or just bare-metal. In any scenario, you'd start by pulling the official Docker image from Docker Hub (`docker pull brunoscheufler/aqueduct:latest`).

Whichever way you deploy aqueduct, the configuration is pretty straightforward and can be set using a simple config file mount to the container's config path (defaults to `/config/aqueduct.yaml`, can be changed using the `AQUEDUCT_CONFIG_PATH` environment variable).

Example config:

```yaml
# Put your endpoints to be schema-stitched below
endpoints:
  - https://api.graphcms.com/simple/v1/swapi
```

Full config reference (with example values):

```yaml
# Has to be a list of absolute URLs, including a protocol (http, etc.) (somehow required)
endpoints:
  - http://sample-service

# API Key for Apollo Engine metrics (optional, can be overriden with AQUEDUCT_ENGINE_KEY)
engineApiKey: <Apollo Engine API Key>

# Aqueduct port (defaults to 4000, can be overriden with AQUEDUCT_PORT)
port: 4000

# Start Aqueduct after n milliseconds (disabled by default, can be overriden with AQUEDUCT_LAUNCH_DELAY)
launchDelay: 10000

# Enable GraphQL Playground on graphql endpoint (also available at /graphql, can be overriden with AQUEDUCT_ENABLE_PLAYGROUND)
enablePlayground: true

# Alternative route to graphql endpoint (defaults to /, can be overriden with AQUEDUCT_PATH)
path: /rainbow

# CORS options (all CORS requests will be accepted by default, see https://github.com/expressjs/cors#configuration-options)
cors:
  origin: 'https://example.com'

# Preflight-specific settings (allow all requests by default, see https://github.com/expressjs/cors#configuration-options)
preflightSettings:
  origin: 'https://webapp.example.com'

# Disable CORS preflight requests (allowed by default, override with AQUEDUCT_DISABLE_CORS_PREFLIGHT)
disablePreflightRequests: true

# Use JWT validation (secret can by overriden with AQUEDUCT_JWT_SECRET)
jwtSecret: <JSON Web Token secret>

# Example helmet configuration (see https://github.com/helmetjs/helmet for more details)
helmet:
  frameguard: false
```

## known bugs

– Errors from stitched services might be displayed strangely, this behaviour originates from a known [bug](https://github.com/apollographql/graphql-tools/issues/743) in [graphql-tools](https://github.com/apollographql/graphql-tools)
