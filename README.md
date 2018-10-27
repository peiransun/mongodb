# Setting Up A MongoDB Database with Docker
For the purpose of this tutorial, I’m going to be using docker in order to quickly get a mongodb instance up and running on my local development machine.

$ docker pull mongo
$ docker run --name my_mongo -d -p 127.0.0.1:27017:27017 mongo

[Note]
If you already have a mongodb instance up and running then please feel free to ignore this step and carry on using your own instance.

# node.js-apps-with-typescript
Developing node.js apps using Typescript

Part 1 - Configuring VS Code for developing node.js apps using Typescript
Part 2 - Adding MongoDb