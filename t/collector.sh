#!/bin/bash
export TAKIPI_LISTEN_PORT=1111
export TAKIPI_SERVER_NAME=$(echo $VCAP_APPLICATION | jq -r '.name')$INSTANCE_INDEX
export TAKIPI_SECRET_KEY=S38797#0IBkissqY8b2aweQ#1vFP55KxTDmFqfaS3yD6haEKWdqfYgRGbNSuh17zD9c=#b1ae
tar -xzvf takipi-4.37.7.tar.gz
#sed -i "s @TAKIPI_BACKEND@ $TAKIPI_BASE_URL g" collector.properties
cp collector.properties takipi
takipi/bin/takipi-service -l
