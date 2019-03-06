#!/bin/bash
set
export TAKIPI_LISTEN_PORT=$PORT
export TAKIPI_SERVER_NAME=$(echo $VCAP_APPLICATION | jq -r '.name')$INSTANCE_INDEX
tar -xzvf takipi-latest.tar.gz
sed -i "s @TAKIPI_BACKEND@ $TAKIPI_BASE_URL g" collector.properties
cp collector.properties takipi
nohup takipi/bin/takipi-service -nfd &
