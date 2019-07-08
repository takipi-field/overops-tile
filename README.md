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

1. If the stemcell is missing, [download the latest Ubuntu Xenial 315 stemcell](https://bosh.cloudfoundry.org/stemcells/) for your platform from BOSH and upload it in the Ops Manager.

1. Once the form has been fully filled out click **Review Pending Changes** ensure the tile is selected and click **Apply Changes**.

1. After the changes have been deployed, the OverOps Collector will be in the Org and Space entered during configuration.

1. Map a TCP route to your application with a random port, or specify a port with `--port`:

     ```sh
     cf map-route my_app tcp.example.com --random-port
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

## SSH into a running tile

TODO

## Useful Commands
+ [Cheat Sheet for Cf Commands](https://blog.anynines.com/cloud-foundry-command-line-cheat-sheet/)

+ ```cf ssh app_name``` to do this command please make sure you have ssh enabled in your container. to enable ssh ```cf enable-ssh app_name```
++ ```cf space-quotas```
+ ```cf create-quota QUOTA [-m TOTAL-MEMORY] [-i INSTANCE-MEMORY] [-r ROUTES] [-s SERVICE-INSTANCES] [--allow-paid-service-plans] ```
+ ```cf cups service_name -t "takipi" -p '{"collector_host":"tcp_domain", "collector_port":"port_to_app"}'``` create a service that will activate the takipi agent inside of the java buildpack
+```cf uups service_name -t "takipi" -p '{"collector_host":"tcp_domain", "collector_port":"port_to_app"}'``` updated the current service
+ ``` cf target -o org_name -s space_name ```

## Common Problems

* If you are having problems using TCP communication please refer to https://docs.pivotal.io/pivotalcf/2-5/adminguide/enabling-tcp-routing.html

* On every environment the TCP port ranges vary. GCP has a range of 1024-1123. Please refer to your environments provider for the correct port ranges to specify on your environment.

* This collector deploys using `stdout` to write logs. The UI logs section will show the collector logs

* To see the agent logs please `cf ssh app_name` and go to `app/.java-buildpack/takipi-agent/logs/agents` and check the `bug` log. If the correct credentials have been passed to the Agent please make sure the route to the collector is correct. Otherwise please refer to the environment settings and make sure the TCP port is in range and that the domain is properly using `default-tcp`

* **Missing Stemcell**? Download the latest BOSH [stemcell](https://bosh.cloudfoundry.org/stemcells/bosh-aws-xen-hvm-ubuntu-xenial-go_agent) for your environment. See [Stemcell (Linux) Release Notes](https://docs.pivotal.io/pivotalcf/2-6/stemcells/stemcells.html#315-line). Tile v0.9.6 requires `ubuntu-xenial` version `315`. (light version is ok).

## Common Problems
- If you are having problems using TCP communication please refer to https://docs.pivotal.io/pivotalcf/2-5/adminguide/enabling-tcp-routing.html
- On every environment the TCP port ranges vary. GCP has a range of 1024-1123. Please refer to your environments provider for the correct port ranges to specify on your environment. 
- This collector sends all logs to stdout. The UI logs section will show the collector logs

## Troubleshooting
-To see the agent logs, ssh into your app and do ```cd app/.java-buildpack/takipi-agent/logs/agents``` and look at the ```bug``` log.
- To see the collector logs, please check stdout in the Apps Manager UI console of your application. 
- Double check to make sure that routes section is not set to 0. To check ```cf quotas``` 
- Check that there are reservable ports in your quota. Ex update ```default``` quota ```cf update-quota default --reserved-route-ports 20```
To see the agent logs please ssh into your app and go to `app/.java-buildpack/takipi-agent/logs/agents` and check the `bug` log. If the correct credentials have been passed to the Agent please make sure the route to the collector is correct. Otherwise please refer to the environment settings and make sure the TCP port is in range and that the domain is properly using ```default-tcp```
