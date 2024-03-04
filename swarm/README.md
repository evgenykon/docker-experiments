### my steps
Based on official manuals: 
https://docs.docker.com/engine/swarm/
https://docs.docker.com/network/network-tutorial-overlay/#use-the-default-overlay-network

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
5. Check nodes on manager `docker node ls`
6. Check networks on manager `docker network ls`
7. Create network on manager host `docker network create -d overlay experiment`
``` 
docker stack deploy -c ./docker-compose.yml exp
docker stack services exp
docker service ps --no-trunc exp_nginx-1
docker stack rm exp
```