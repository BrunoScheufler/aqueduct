# aqueduct

> A cloud-native GraphQL-powered gateway service for the infrastructure of the future!

## description

aqueduct is a scalable service for bundling, monitoring and securing GraphQL services, functioning as a gateway. While it's admittedly minimal currently, aqueduct will get integrations for logging, metrics and more in the near future, to be used in large, distributed setups.

## getting started

Generally speaking, you are able to deploy aqueduct in almost every setup you can imagine, whether it's through Docker Compose, Kubernetes or just bare-metal. In any scenario, you'd start by pulling the official Docker image from Docker Hub (`docker pull brunoscheufler/aqueduct:latest`).

Whichever way you deploy aqueduct, the configuration is pretty straightforward and can be set using a simple config file mount to the container's config path (defaults to `/config/aqueduct.yaml`, can be changed using the `AQUEDUCT_CONFIG_PATH` environment variable).

Example config:

```yaml
# Put your endpoints to be schema-stitched below
endpoints:
    - https://api.graphcms.com/simple/v1/swapi
```

Full config reference:

```yaml
# Has to be a list of absolute URLs, including a protocol (http, etc.) (somehow required)
endpoints:
    - http://sample-service

# API Key for Apollo Engine metrics (optional, can be overriden with AQUEDUCT_ENGINE_KEY)
engineApiKey: <Apollo Engine API Key>

# Aqueduct port (defaults to 4000, can be overriden with AQUEDUCT_PORT)
port: 4000
```
