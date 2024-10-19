Prometheus on a Raspberry Pi

```sh
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker pi
sudo apt install docker-compose
```
then logout and back in again, to get the new group changes

then start everything:
```sh
docker-compose up --build
```

## Enable auto-start

in the docker-compose file, 'restart: always' will cause it to always start on boot

if you have started the service onece with: `docker-compose up -d`
