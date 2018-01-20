# Setting Up The Drones
* attempt_to_connect_to_router.sh must be placed in the root of the drone.
* The variable 'droneID' must be replaced with a two digit number unique to this
    drone. As this will form the last two digits of the ip it uses, there may be
    restrictions placed on this by the router being used.
* The variable 'networkName' must be replaced with the name of the open network
    you want the drone to connect to. It may not have a password (currently),
    but a MAC address lockout is recommended.
* /attempt_to_connect_to_router.sh must be made executable, with the command
    'chmod +x /attempt_to_connect_to_router.sh'
* A file named should_try_to_connect_to_network.txt should also be placed in the
    root containing only 'true' (this can be left out, but the drone will need
    to be booted up twice before it will auto connect).
* The line '/attempt_to_connect_to_router.sh' must be added to the end of the
    file at '/bin/wifi_setup.sh'
* The drone must then be rebooted, and it should automatically connect the
    network of the name in the variable 'networkName', if it is there, and if it
    is not it should then reboot, and host its network as usual.
