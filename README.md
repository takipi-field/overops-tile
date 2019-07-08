# OverOps Tile for Pivotal Cloud Foundry (PCF)

This repository is the OverOps Collector Tile used in Pivotal Cloud Foundry (PCF), please find below the steps required to build and use the tile.

## Prerequisites

* [Install the `cf` CLI](https://docs.cloudfoundry.org/cf-cli/install-go-cli.html)

* If building the tile, [Install the Tile Generator](https://docs.pivotal.io/tiledev/2-6/tile-generator.html#how-to)

* [Log in to Cloud Foundry](https://docs.cloudfoundry.org/cf-cli/getting-started.html)

  ```sh
  cf login [-a API_URL] [-u USERNAME] [-p PASSWORD]
  ```

* [Enable TCP Routing](https://docs.cloudfoundry.org/adminguide/enabling-tcp-routing.html). Confirm with:

  ```sh
  $ cf router-groups

  Getting router groups as admin ...

  name          type
  default-tcp   tcp
  ```

* Confirm a TCP shared domain exists:

  ```sh
  $ cf domains

  Getting domains in org system as admin...
  name                             status   type   details
  apps.kabul.cf-app.com            shared
  mesh.apps.kabul.cf-app.com       shared
  apps.internal                    shared          internal
  mesh.tcp.apps.kabul.cf-app.com   shared
  tcp.kabul.cf-app.com             shared   tcp
  sys.kabul.cf-app.com             owned
  ```

* Create a TCP shared domain if one does not already exist:

  ```sh
  cf create-shared-domain tcp.example.com --router-goups default-tcp
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

* Use the [Java Buildpack](https://github.com/cloudfoundry/java-buildpack) or the [Java Offline Buildpack](https://docs.pivotal.io/pivotalcf/2-6/buildpacks/java/index.html) for your app. The Java Buildpack contains the [Takipi Agent Framework](https://github.com/cloudfoundry/java-buildpack/blob/master/docs/framework-takipi_agent.md). Apply the tag `takipi` to enable the Agent.

## Installing the Tile

1. Download the [latest release](https://github.com/takipi-field/overops-tile/releases) `.pivotal` file.

1. In Ops Manager click **Import a Product** and select the `.pivotal` file you downloaded.

1. Click the **+** sign under OverOps Reliability Platform to add the tile.

1. The OverOps Reliability Platform tile should have an orange color specifying that there are form values that need to entered. Enter the proper form values needed to make the tile turn green.

1. If the Stemcell is missing, [download the latest Ubuntu Xenial 315 Stemcell](https://bosh.cloudfoundry.org/stemcells/) for your platform from BOSH and upload it in the Ops Manager. Either the Light Stemcell or the Full Stemcell will work.

1. Once the form has been fully filled out click **Review Pending Changes** ensure the tile is selected and click **Apply Changes**.

1. After the changes have been deployed, the OverOps Collector will be in the Org and Space entered during configuration.

1. Map a TCP route to the Collector with a random port, or specify a port with `--port`. Note app name will contain version number, e.g. `overops-collector-0.9.15`.

     ```sh
     cf map-route overops-collector tcp.example.com --random-port
     ```

1. Create a user defined service to set `collector_host` and `collector_port` and tag with `takipi` to enable the Agent:

     ```sh
     cf cups overops-service -t "takipi" -p '{"collector_host":"tcp.example.com", "collector_port":"1234"}'`
     ```

1. Bind the service to your application:

     ```sh
     cf bind-service my_app overops-service
     ```

1. Restage your application:

     ```sh
     cf restage my_app
     ```

1. Confirm connectivity with the backend by going to [https://app.overops.com/](https://app.overops.com).

## Building the Tile

To build the tile (`.pivotal` file) from `tile.yml`, run:

```sh
tile build
```

Version number is incremented based on `tile-history.yml`.

## Upgrading the Collector

1. Download the [latest Collector](https://app.overops.com/app/download?t=tgz)

1. Move `overops-collector.jar` to a temporary folder

    ```sh
    mkdir tmp
    mv overops-collector.jar tmp
    ```

1. Extract the jar

    ```sh
    jar xf overops-collector.jar
    rm overops-collector.jar
    ```

1. Replace the Collector

1. Create a new jar

    ```sh
    jar cMvf overops-collector.jar *
    ```

1. Replace the jar

    ```sh
    mv overops-collector.jar ..
    cd ..
    rm -r tmp
    ```

1. Update the version in `tile.yml`

## Useful Commands

* [Cheat Sheet for CF Commands](https://blog.anynines.com/cloud-foundry-command-line-cheat-sheet/)

  * [Cheat Sheet PDF](readme/a9s-CF-Cheat-Sheet.pdf)

* Enable SSH

  ```sh
  cf enable-ssh app_name
  ```

* SSH into a running tile

  ```sh
  cf ssh app_name
  ```

* Update user defined service

    ```sh
    cf uups overops-service -t "takipi" -p '{"collector_host":"tcp_domain", "collector_port":"port_to_app"}'
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
