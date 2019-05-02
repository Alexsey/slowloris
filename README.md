There are three Docker containers - `victim`, `attack` and `test`

## Quick Start

#### Run

Start Nginx with default page on `localhost:50000`

    docker build -t victim victim && docker run -it --ulimit nofile=245760:245760 --name victim -p 127.0.0.1:50000:80 -d victim
    
Start Slowloris attack on it with up to 5000 connections
    
    docker build -t attack ./attack && docker run --network="host" --name="attack" --env VICTIM=http://localhost:50000 --env LIMIT=5000 attack
    
And from another terminal, start `test`

    docker build -t test ./test && docker run --network="host" --name="test" --env VICTIM=http://localhost:50000 test

#### Stop & Clean

    docker stop attack && docker rm attack && docker image rm attack
    docker stop test && docker rm test && docker image rm test
    docker stop victim && docker rm victim && docker image rm victim
    
## Description

#### Victim

Is a Docker container that holds setup Nginx that should handle Slowloris attack... better than
with default setup. It can return only one page - default, that would be exposed on `50000` port of
the host

To configure the port to expose, change the `50000` of the start script

#### Attack

Is a Docker container that takes victim url and desired amount of parallel connections. Will log
each second the current amount of connections. For not making it a regular DDoS, it will open 100
connections per second. So to open 10000 it will take 100 seconds

To configure the victim url and the number of parallel requests change `VICTIM` and `LIMIT` values
of the start script

If the victim fall, the log value would go to negative

#### Test

Is a Docker container that request the victim, measure the full response time, log it with the
response code, wait for a second and start over again

To configure the victim url change `VICTIM` value of the start script

If the victim fall, the the `test` will crash
