#!/bin/bash
tar -xzvf takipi-4.38.0.tar.gz
cp collector.properties takipi
nohup takipi/bin/takipi-service -l &