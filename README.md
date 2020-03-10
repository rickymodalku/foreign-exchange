# Introduction
Alice Write Web 3 is an Angular SPA that powers Funding Societies/Modalku websites.

# Getting Started
Please install [Node.js](https://nodejs.org/en/download/) or you can use [nvm](https://github.com/creationix/nvm#install-script) to help you manage the different versions of Node.js

Node >8.11.1 or npm >=5.6.0

# Installing dependencies
```
npm i 
```

After running npm install, the build for staging will start immediately, this is due to the fact that we are building it for heroku environment. 

You can cancel it for local development.

# Folder Structure
| Folder | Function |
|--------|:---------|
|configurations| This is the place that we place country specific configuration as well as feature toggle for various countries.|
| environments | Storing environment specific variables|
| _borrower| Storing all borrower specific components|
| _investor | Storing all investor specific components|
| _public | Storing all public facing components|
| models | Storing all the models used in the components|
| services | All services used in the components|
| assets | All static resources are stored here |
| root | app.json, Procfile, server.js is used for running heroku app|
| replaceBuild.js | This is used to create a staging version number|


# Development

Run `npm start` will default to Malaysia website by default. For specific country website, the instructions are as follows. You can refer to country specific in [run command in package.json](https://github.com/fundingasiagroup/alice-writes-web-3/blob/master/package.json#L8) 

Run `npm run start-id` to run a local server for Indonesia website. The application should be hosted at `http://localhost:4200`

Run `npm run start-my` to run a local server for Malaysia website. The application should be hosted at `http://localhost:4300`

Run `npm run start-sg` to run a local server for Singapore website. The application should be hosted at `http://localhost:4400`

By default the applications are pointing to the staging cluster.

# Firebase dependencies
The app relies heavily on firebase to retrieve translations as well as storing some key parts of the appplication code. Refractoring is on the way to make sure that all the translation should be done within this repo instead of hosting it in firebase.

Please request firebase access from @vamsi to start editing the json file.
https://console.firebase.google.com/project/alice-writes-web-3/database/alice-writes-web-3/data/


(Refractoring translation)[https://github.com/fundingasiagroup/alice-writes-web-3/issues/1329]

PLEASE NOTE NOT TO USE ARRAY ANYMORE IN FIREBASE as ngx-translate extraction won't work properly with array.

# Maintenance mode
Maintenance mode can also be toggled in firebase:
alice-write-web-3 -> production-maintenance-mode

Set it to `true` to turn on the production mode or `false` to set it off.

# Contributing
Do create an issue on jira first and create a branch based on the issue number. For example, the issue number FRON-2386
is created for a jira issue. We can use the jira issue number to create a branch based on that, which is FRON-2386_IssueDescription, this will enable us to transition the status of the jira ticket issue automatically.

When a feature is ready to be tested, you can raise a PR and a [Heroku Review app](https://dashboard.heroku.com/pipelines/06ed8a78-7c97-4d19-850b-ba540e9b86f4) will spin up after it is being build. 

After the feature is tested, it can be merged into the master branch and the feature will be deployed to the staging environment automatically by [CircleCI](https://circleci.com/gh/fundingasiagroup/alice-writes-web-3/).

If you need to have access to the Heroku pipeline of CircleCI workflow, you can reach out to @cheng_yong @ricky or @daniel.inki on slack.

# Linting
As of now, we are not enforcing linting since the codebase is not fully linted as of now, but please adhered to tslist warning and try to fix all of them in your new code.

# Testing
No test is being run now, only selenium e2e test cases are being run nightly.

# Deployment
To create a deployment to production, you can create a release tag from github with the version number in the following format `v1.2.3`. 
The actual format is defined in [config.yml](https://github.com/fundingasiagroup/alice-writes-web-3/blob/master/.circleci/config.yml#L126).

Once a tag is created, CircleCI will automatically build and release to production.
You can follow the progress of the deployment by checking it in CircleCI.

You can check that the build version in production is updated by checking the production version number with the short git hash currently in the HEAD of master.

If you ever need to cancel the deployment, you can log into CircleCI filter the project by alice-write-3 and cancel the deployment manually.

If you ever need to redeploy an older version, you can search for the last good deployment that we did and redeploy that version in CircleCI.

If somehow everything fails, we can manually deploy to production using AWS cli. For a start, we can build for production from `master` branch using `npm run build-production`. 

Once the build is successful, we can deploy to s3 bucket using the following s3 command, `aws --region ap-southeast-1 s3 sync dist s3://new.fundingasiagroup.com --delete`.This is provided that you have the credential to do the deployment using awscli. 

Please talk to @felixrichard if you ever need the credential to do the deployment.

## Manual Deployment to CBN server
The manual deployment script for CBN server should be run locally with an assumption that .ssh/config file contains the IP address of id-server1 and also that the public key is added to the CBN server for deployment. If not please approach the team to get the IP of the server.

## Development and Deployment Architecture
We are using Heroku and CircleCI, and AWS Cloudfront to manage our front end archtecture. You can read more [here](https://github.com/fundingasiagroup/FundingAsiaGroup/wiki/Front-End-Deployment-autobot).

