# Fireworker
## Introduction
Fireworker is a web app that will allow for the secure sending and retrieval of sensitive information. It was inspired my mission impossible and the self destructing message delivery by the fictional governments of Great Britain and the United States.

## Features
* Allows for users to share files with sensitive data such that they can only be downloaded once.
* Allows users to know that their sensitive files are transmitted around the world securely.

## Installation
Install fireworker on your server by running the terminal command:
```
npm install
```

To run fireworker first startup the mongodb deamon by running

``` 
sudo mongod 
``` 

then startup the server with the command 

``` 
npm start 
```

---


![index page](./help_files/fireworkermain.png)
![login page](./help_files/fireworkerlogin.png)
![link token](./help_files/fireworkerlink.png)


## Bug Fixes 
* Check if username/email already exists in database
* Check on page load if token user id exists in database
* Check that user can't submit record with no files selected
* 


If fireworker doesn't initially work, try removing node_modules folder and reinstall by entering

```
    npm install
```
into the terminal.