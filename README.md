# Fireworker

[![Build Status](https://travis-ci.org/JSitter/fireworker.svg?branch=master)](https://travis-ci.org/JSitter/fireworker)


## Introduction
Fireworker is a web app that will allow for the secure sending and retrieval of sensitive information. It was inspired by mission impossible and the self destructing message delivery by the fictional governments of Great Britain and the United States.

## Features
* Allows for users to share files with sensitive data such that they can only be downloaded once.
* Allows users to know that their sensitive files are transmitted around the world securely.

## Requirements
* Node version 7.0 or greater
* MongoDB

## Installation
Install fireworker on your server by running the terminal command:
```
npm install
```

## Setup environment variables
In order for this app to run, a certain number of environment variables must be set. 

These should be set in the `.env` file in the root directory, or set somewhere else in the server.

### Twilio Requirements
In order to work with Twilio, this app needs a few authorization tokens to authenticate with Twilio's services.

`TWILIO_AUTH` and `TWILIO_SID` are both required and refer to their authorization token and SID respectively.

`TWILIO_PHONE` is the phone number the number from which this message is sent.

### Mailgun Requirements
Email support was added using `node-mailer` together with Mailgun support. Currently in order to send emails this app needs auth tokens for the Mailgun API

`MAILGUN_API_KEY` is required to send email messages.
Email messages will be sent from the domain specified by `EMAIL_DOMAIN`.

### Stripe Payments Requirements
This app uses the Stripe payment gateway to add the ability for users to donate large sums of money.

In order for this to function `PUBLIC_STRIPE_API_KEY` and `PRIVATE_STRIPE_API_KEY` must be set with your Stripe account information.


## Running the Server
To run fireworker first startup the mongodb daemon by running

``` 
sudo mongod 
``` 

then startup the server with the command 

``` 
npm start 
```

---


![index page](./help_files/fireworkermain.png)
![dashboard page](./help_files/userdash.png)


## Planned Features
* Message Flashing
* Better Compatibility with Mobile
* Delete documents by owner

## Bugs to fix 
* Check on page load if token user id exists in database
* Check that user can't submit record with no files selected

## ENOSPC error
`echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`

https://stackoverflow.com/questions/22475849/node-js-what-is-enospc-error-and-how-to-solve