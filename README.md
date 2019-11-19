# Vanhack-Beanworks Challenge

This project is a hackathon challenge organized by [VanHack](https://www.vanhack.com/) with a task provided by [Beanworks](https://www.beanworks.com/).


## Business requirements

- As a user, I want to be able to trigger a sync of my data from my erp on demand
- As a user, I want to be able to see the data sets that are imported from my ERP
- As a user, I want to be able to see the time when I last initiated a sync
- As a user, I want to be able, per sync request, to get the detailed sync process timeline, so
that I can determine exactly when my data exported from my erp to my app

## Architecture

![Architecture](/documentation/Architecture.jpg)

## Running application

### Prerequisites

In order to build and run this application please perform next steps:

* Install Node.js ([https://nodejs.org/en/download/](https://nodejs.org/en/download/))
* Install MongoDB ([https://www.mongodb.com/download-center/community](https://www.mongodb.com/download-center/community))
* Clone repository to local directory ([how to clone](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository))

### Configuration

To change default web server configuration please edit ~/configs/production/server.config.json file. It contains next settings:

*port* - port which is used to run web server<br/>
*socketUrl* - endpoint for establishing socket connections to update UI real time<br/>
*connectionString* - connection string to a MongoDB database

To change default Xero connection configuration please edit ~/configs/production/xero.config.json file.

### Running

- Open Command Line / Terminal in your system and navigate to the directory with clonned repository
- To build project execute next commands:

```
npm install
npm run build:prod
```

- To run application run next command:

```
npm start
```

Open in the browser http://localhost:3000/ (or specify another port if it has been changed in config file).
