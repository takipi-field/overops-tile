# OverOps Tile for Pivotal Cloud Foundry (PCF)

This repository is the OverOps Collector Tile used in Pivotal Cloud Foundry (PCF), please find below the steps required to build and use the tile.

## Prerequisites

* [Install the `cf` CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

* If building the tile, [Install the Tile Generator](https://docs.pivotal.io/tiledev/2-6/tile-generator.html#how-to)

* [Log in to Cloud Foundry](https://docs.cloudfoundry.org/cf-cli/getting-started.html)

  ```sh
  cf login [-a API_URL] [-u USERNAME] [-p PASSWORD]
  ```

* Confirm that the `apps.internal` domain exists:

  ```sh
  cf domains
  ```

* Confirm an Org exists:

  ```sh
  $ cf orgs

  Getting orgs as admin...

  name
  my-org
  system
  ```

* Create an Org if one does not exist:

  ```sh
  cf create-org my-org
  ```

* Target the Org:

  ```sh
  cf target -o my-org
  ```

* Confirm a Space exists:

  ```sh
  $ cf spaces

  Getting spaces in org my-org as admin...

  name
  my-space
  ```

* Create a Space if one does not exist:

  ```sh
  cf create-space my-space
  ```

* Target the Space:

  ```sh
  cf target -o my-org -s my-space
  ```

* Use the [Java Buildpack](https://github.com/cloudfoundry/java-buildpack) for your app. The Java Buildpack contains the [Takipi Agent Framework](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/framework-takipi_agent.md). Apply the tag `takipi` to enable the Agent.

## Installing the Tile

1. Download the [latest release](https://github.com/takipi-field/overops-tile/releases) `.pivotal` file.

1. In Ops Manager click **Import a Product** and select the `.pivotal` file you downloaded.

1. Click the **+** sign under OverOps Reliability Platform to add the tile.

1. The OverOps Reliability Platform tile should have an orange color specifying that there are form values that need to entered. Enter the proper form values needed to make the tile turn green.

1. If the Stemcell is missing, [download the latest Ubuntu Xenial 315 Stemcell](https://bosh.cloudfoundry.org/stemcells/) for your platform from BOSH and upload it in the Ops Manager. Either the Light Stemcell or the Full Stemcell will work.

1. Once the form has been fully filled out click **Review Pending Changes** ensure the tile is selected and click **Apply Changes**.

1. After the changes have been deployed, the OverOps Collector will be in the Org and Space entered during configuration.

1. Map an `apps.internal` route to the Collector with a hostname with `--hostname name`. This is a shared domain. Be sure to use a unique hostname for each Collector. Note `my-app` will contain version number, e.g. `overops-collector-0.9.1`.

     ```sh
     cf map-route overops-collector apps.internal --hostname collector
     ```

1. Add a network policy between the container to monitor and the collector. The source app is the application with the OverOps Agent.

    ```sh
    cf add-network-policy my-app --destination-app overops-collector -s DESTINATION_SPACE_NAME -o DESTINATION_ORG_NAME --protocol tcp --port 8080
    ```

1. Create a user defined service to set `collector_host` and `collector_port`(default port that a container listens on is 8080) and tag with `takipi` to enable the Agent:

     ```sh
     cf cups overops-service -t "takipi" -p '{"collector_host":"collector.apps.internal", "collector_port":"8080"}'
     ```

1. Bind the service to your application:

     ```sh
     cf bind-service my-app overops-service
     ```

1. Restage your application:

     ```sh
     cf restage my-app
     ```

1. Confirm connectivity with the backend by going to [https://app.overops.com/](https://app.overops.com).

## Upgrading the Collector

1. Download the [latest Collector](https://app.overops.com/app/download?t=tgz)

## Building the Tile

To build the tile (`.pivotal` file) from `tile.yml`, run:

```sh
tile build
```

Version number is incremented based on `tile-history.yml`.

## Useful Commands

* [Cheat Sheet for CF Commands](https://blog.anynines.com/cloud-foundry-command-line-cheat-sheet/)

  * [Cheat Sheet PDF](readme/a9s-CF-Cheat-Sheet.pdf)

* Enable SSH

  ```sh
  cf enable-ssh my-app
  ```

* SSH into a running tile

  ```sh
  cf ssh my-app
  ```

* Update user defined service

    ```sh
    cf uups overops-service -t "takipi" -p '{"collector_host":"collector.apps.internal", "collector_port":"8080"}'
    ```

* Need a sample app? Use [Spring Music](https://github.com/cloudfoundry-samples/spring-music)

## Troubleshooting Common Problems

* TCP port ranges vary based on the underlying IaaS provider. GCP has a range of 1024-1123. Please refer to your environment's provider for the correct port ranges to specify on your environment.

* This Collector deploys using `stdout` to write logs. The UI logs section will show the Collector logs.

* To see the Agent logs, SSH into your app and go to `app/.java-buildpack/takipi-agent/logs/agents` and check the logs.

* Make sure that routes section is not set to 0. To check run `cf quotas`

* Check that there are reservable ports in your quota. For example, to update the `default` quota to 20:

    ```sh
    cf update-quota default --reserved-route-ports 20
    ```
