#!/bin/sh

droneID=00
networkName=control
IP=192.168.1.1$droneID
routerIP=192.168.1.1
timeout=4
shouldTryToConnectToNetworkFlagFile=/should_try_to_connect_to_network.txt

if [ `cat $shouldTryToConnectToNetworkFlagFile` == "true" ]; then
    # We will try to connect to the network, because it worked last time.
    killall udhcpd
    iwconfig ath0 mode managed essid $networkName
    ifconfig ath0 $IP netmask 255.255.255.0 up
    if ping $routerIP -w $timeout; then
        # It worked, we are connected.
        echo "true" > $shouldTryToConnectToNetworkFlagFile
    else
        # We couldn't connect, reboot to start up our network as usual.
        echo "false" > $shouldTryToConnectToNetworkFlagFile
        reboot
    fi
else
    # We failed to connect last time, so, we should not override the default 
    # setup, but, we should try to connect again, next time we start up.
    echo "true" > $shouldTryToConnectToNetworkFlagFile
fi

