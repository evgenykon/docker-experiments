### my steps
Based on official manual: https://docs.docker.com/engine/swarm/
1. Run container in first host (Ubuntu inside virtualbox with ZeroTier VPN): `docker compose --file compose-node-1.yml up -d`
2. Create a swarm manager in same host (it will be a manager): ` docker swarm init --advertise-addr <ZeroTier host IP>`
3. Check port is open:
``` 
$ sudo lsof -PiTCP -sTCP:LISTEN | grep 2377`
dockerd    836            root   32u  IPv6  23543      0t0  TCP *:2377 (LISTEN)
```
4. Connect to second node and join with command been outputs from swarm init:
```
docker swarm join --token <from output> <ZeroTier host IP>:2377
```
