# overops-tile
## BackGround
This repository is the Tile used in Pivotal Cloud Foundry, please find below the steps required to use this Tile. 

## Pre-Requisites 
In your application please make sure to have the [Java Buildpack](https://github.com/cloudfoundry/java-buildpack) or the [Java Offline Buildpack](https://docs.pivotal.io/pivotalcf/2-4/buildpacks/java/index.html). 
On your environment please make sure to have TCP communication enabled. A good way to double check is to see if there is the `default-tcp` router group. To check do `cf router-groups`. 
## Setup
1. Clone [overops-tile](https://github.com/takipi-field/overops-tile) and get the product/.pivotal file and upload it through the Ops Manager in cloud foundry. 
2. In Ops Manager click Import Product(top right) and select the .pivotal you downloaded
3. Click the `+` sign below the Import button to add the changes to your Tile.
4. The OverOps Reliability Platform Tile should have an orange color specifying that, the proper form values need to be filled out. 
5. Once form values have been filled out, click `Apply Changes` and only select the OverOps Reliability Platform. By default all Tiles are selected.  
6. Create a TCP domain `cf create-shared-domain tcp.example.com --router-goups default-tcp`  
7. After the changes have been deployed, please go to your OverOps Collector in overops-org and overops-space. Map a TCP route to your application, `cf map-route app_name tcp.hostname_ex.com --random-port`. This is mapping a tcp route and selecting a random port `--port` can be used to select a specific port.
7. Deploy your application to the same environment and provide a service that passed in two properties. `collector_host` and `collector_port`. Ex `cf cups overops-service -t "takipi" -p '{"collector_host":"tcp.hostname_ex.com", "collector_port":"1234"}'
8. After service has been made bind it to your application. `cf bind-service app_name takipi-service` and then restage your application `cf restage app_name`. Once the app has deployed please check app.overops.com and make sure OverOps is functioning properly. 

## Common Problems
- If you are having problems using TCP communication please refer to https://docs.pivotal.io/pivotalcf/2-5/adminguide/enabling-tcp-routing.html
- On every environment the TCP port ranges vary. GCP has a range of 1024-1123. Please refer to your environments provider for the correct port ranges to specify on your environment. 
- This collector deploys using `stdout` to write logs. The UI logs section will show the collector logs
- To see the agent logs please `cf ssh app_name` and go to `app/.java-buildpack/takipi-agent/logs/agents` and check the `bug` log. If the correct credentials have been passed to the Agent please make sure the route to the collector is correct. Otherwise please refer to the environment settings and make sure the TCP port is in range and that the domain is properly using `default-tcp`


