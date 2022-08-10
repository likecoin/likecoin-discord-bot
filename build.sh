#!/usr/bin/env bash

PWD=`pwd`
WD=`cd $(dirname "$0") && pwd -P`

cd "${WD}"

docker buildx build . -t like-discordbot --platform linux/amd64
docker tag like-discordbot:latest us.gcr.io/likecoin-foundation/like-discordbot:latest
docker -- push us.gcr.io/likecoin-foundation/like-discordbot:latest

cd "${PWD}"
