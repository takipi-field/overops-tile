# OverOps-Tile
## BackGround
This repository is the Tile used in Pivotal Cloud Foundry, please find below the steps required to use this Tile. 

## Pre-Requisites 
In your app please make sure to have the [Java Buildpack](https://github.com/cloudfoundry/java-buildpack) or the [Java Offline Buildpack](https://docs.pivotal.io/pivotalcf/2-4/buildpacks/java/index.html). 
Also make sure to have TCP communication enabled, this means having a default-tcp router group. Double check is to see if there is the ```default-tcp``` router group. 
To check do this ```cf router-groups```. If it does not pop up please refer to [TCP Routing](https://docs.cloudfoundry.org/adminguide/enabling-tcp-routing.html)
## Setup
1. Clone [overops-tile](https://github.com/takipi-field/overops-tile) and get the ```product/overops-collector-version_#.pivotal``` file and upload it through the Ops Manager in cloud foundry. 
2. In Ops Manager click ```Import Product``` and select the .pivotal you downloaded
3. Click the ```+``` sign below the Import button to add the changes to your Tile.
4. The OverOps Reliability Platform Tile should have an orange color specifying that there are form values that need to entered. Enter the proper form values needed to make the tile turn green. 
5. If needed please download a stemcell from [Stemcells](https://bosh.cloudfoundry.org/stemcells/), the Ubuntu Xenial 315 is the stemcell used during development and submit it to the OverOps Tile. 
6. Once the form has been fully filled out click `apply changes` and select the Tiles you are using and let it deploy. Please mind that specifying an Org and Space that already have the OverOps tile deployed to will override the current collector in there.    
7. (If there is a TCP enabled Domain already skip this step)Create a TCP domain `cf create-shared-domain tcp.example.com --router-goups default-tcp` 7. After the changes have been deployed, please go to your OverOps Collector in overops-org and overops-space. Map a TCP route to your application, ```cf map-route app_name tcp.hostname_ex.com --random-port```. This is mapping a tcp route and selecting a random port ```--port``` can be used to select a specific port.
8. Deploy your application to the same environment and provide a service that passed in two properties. ```collector_host``` and ```collector_port```. Ex ```cf cups overops-service -t "takipi" -p '{"collector_host":"tcp.hostname_ex.com", "collector_port":"1234"}```
9. After service has been made bind it to your application. ```cf bind-service app_name takipi-service``` and then restage your application ```cf restage app_name```. Once the app has deployed please check app.overops.com and make sure OverOps is functioning properly. 

## Common Problems
- If you are having problems using TCP communication please refer to https://docs.pivotal.io/pivotalcf/2-5/adminguide/enabling-tcp-routing.html
- On every environment the TCP port ranges vary. GCP has a range of 1024-1123. Please refer to your environments provider for the correct port ranges to specify on your environment. 
- This collector sends all logs to stdout. The UI logs section will show the collector logs

## Useful Commands
+ [Cheat Sheet for Cf Commands](https://blog.anynines.com/cloud-foundry-command-line-cheat-sheet/)

+ ```cf ssh app_name```
+ ```cf create-quota QUOTA [-m TOTAL-MEMORY] [-i INSTANCE-MEMORY] [-r ROUTES] [-s SERVICE-INSTANCES] [--allow-paid-service-plans] ```
+ ```cf space-quotas```
+ ```cf cups service_name -t "takipi" -p '{"collector_host":"tcp_domain", "collector_port":"port_to_app"}'``` create a service that will activate the takipi agent inside of the java buildpack
+ ``` cf target -o org_name -s space_name ```

## Troubleshooting
-To see the agent logs, ssh into your app and do ```cd app/.java-buildpack/takipi-agent/logs/agents``` and look at the ```bug``` log.
- To see the collector logs, please check stdout in the Apps Manager UI console of your application. 
- Double check to make sure that routes section is not set to 0. To check ```cf quotas``` 
- Check that there are reservable ports in your quota. Ex update ```default``` quota ```cf update-quota default --reserved-route-ports 20```
To see the agent logs please ssh into your app and go to `app/.java-buildpack/takipi-agent/logs/agents` and check the `bug` log. If the correct credentials have been passed to the Agent please make sure the route to the collector is correct. Otherwise please refer to the environment settings and make sure the TCP port is in range and that the domain is properly using ```default-tcp```




