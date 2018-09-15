# aqueduct

> A cloud-native GraphQL-powered gateway service for the infrastructure of the future!

## description

aqueduct is a scalable service for bundling, monitoring and securing GraphQL services, functioning as a gateway. While it's admittedly minimal currently, aqueduct will get integrations for logging, metrics and more in the near future, to be used in large, distributed setups.

## getting started

Generally speaking, you are able to deploy aqueduct in almost every setup you can imagine, whether it's through Docker Compose, Kubernetes or just bare-metal. In any scenario, you'd start by pulling the official Docker image from Docker Hub (`docker pull brunoscheufler/aqueduct:1.0.0`).

Whichever way you deploy aqueduct, the configuration is pretty straightforward and can be set using a simple config file mount to the container's config path (defaults to `/config/aqueduct.yaml`, can be changed using the `CONFIG_PATH` environment variable).

Example config:

```yaml
# Put your endpoints to be schema-stitched below
endpoints:
    - https://api.graphcms.com/simple/v1/swapi

# Apollo Engine API key
engineApiKey: <Your service API Key (optional)>
```
