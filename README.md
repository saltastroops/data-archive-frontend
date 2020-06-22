# SAAO/SALT Data Archive frontend

This project provides the web frontend for using the SAAO/SALT Data Archive.

## Setting up for development

### Step 1: Getting started

#### Cloning the code 

To clone this repository to your development machine, you need to run the following command (assuming that `git` is installed on your machine.

```bash
git clone HTTPS://github.com/saltastroops/data-archive-frontend.git frontend
```

A directory of name `frontend` with the frontend code will be created.

You may choose another name for the directory. In this case you will have to change the commands in this README accordingly.

Then you can install the required Node packages and run the development server. Node and npm must be installed on your machine.

```bash
cd frontend
yarn install
yarn start
```

Note that Husky is used for linting code before committing it to a Git repository. In order for this to work, the Git repository must exist already when you install the Node packages.

#### Workflow policy

No code changes should be pushed to either the development or the master branch. Instead, create a new local branch from the development branch, make your changes and push the branch to the Github repository.

Afterwards make a a pull request in Github from the new branch to the development branch.

Someone else should check the pull request. They may pull the new branch to their own machine, fix errors, commit their changes and push the updated branch.

Once work on a branch other than master or development is done, that branch should be deleted both locally and on Github.

Code on the production server should always be pulled from the master branch. All releases should be properly tagged with a version.

#### Travis

The code includes a Travis configuration file. It is recommended that Travis is given access to the Github repository and that branch rules enforce that all Travis tests must pass before a pull request can bev merged into the development or master branch.

### Step 2: Setting up environment variables

Environment variables for development, testing and production should be defined in `.env.development`, `.env.test` and `.env.production`, respectively. The following variables can be set.

Variable | Description
---- | ----
REACT_APP_BACKEND_URI | URI of the backend server. Should *not* have a trailing slash.
REACT_APP_SENTRY_DSN | Sentry DSN (Data Source Name).

Sentry is only enabled for production, and you need to set the corresponding environment variable in `.env.production` only.

### Step 3: Running and testing the application

To run the application execute the command `yarn start` in the project's root directory.

To run all the tests of this application execute the command `yarn test` in the project's root directory.
 

## Deployment on an Ubuntu 18 server

### Error tracking

Errors are monitored [Sentry](HTTPS://sentry.io/welcome/) if the environment variable `REACT_APP_SENTRY_DSN` is set in the environment file (see the section on setting up environment variables).

### Installing and configuring nginx

Start by installing yarn.

```bash
curl -sS HTTPS://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb HTTPS://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

This will also install node.

Make sure that Apache2 is not installed

```bash
sudo apt-get remove apache2
``` 

and then install nginx.

```bash
sudo apt-get install nginx
```

Open the default configuration for nginx

```bash
sudo nano /etc/nginx/sites-available/default
```

and add the code below. Here and is the following it is assumed that the code is located in a folder `/var/www/frontend`. You may choose any other folder; update the commands below accordingly.

```text
server {
   listen 80 default_server;
   root /var/www/frontend/build;  # path to the build directory for your project
   server_name xxxxx/;  # server name e.g mywebsite.saao.ac.za
   index index.html index.htm;
   location / {
       try_files $uri /index.html;
   }
}
```

Create a symbolic link in the `sites-enabled` folder to the updated configuration file.
 
```bash
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
```

Start the nginx service.

```bash
sudo service nginx start
```

If the nginx service is running already, you can restart it with

```bash
sudo service nginx restart
```

### Installing the code on the server

Clone the repository,

```bash
git clone HTTPS://github.com/saltastroops/data-archive-frontend.git /var/www/frontend
```

and checkout the correct branch.

```bash
cd /var/www/frontend
git checkout master
```

Then carry out the steps described in the section on updating the code.

### Updating the code on the server

Navigate to the code directory,

```bash
cd /var/www/frontend
```

and pull the latest version of the code from the repository.

```bash
git pull 
```

Install all the dependencies,

```bash
yarn install
```

remove current build folder if it exists,

```bash
rm -r build
```

and build the project.

```bash
yarn build
```

If necessary, restart nginx,

```bash
sudo service nginx restart
```

or reboot the server.

```bash
sudo reboot
```

The above steps are explained in detail [in this article](HTTPS://medium.com/@timmykko/deploying-create-react-app-with-nginx-and-ubuntu-e6fe83c5e9e7).

## Adding HTTPS to the SALT/SAAO Data Archive

There are some pre-requisites to adding HTTPS to the site. You need Nginx to be running already, the Nginx configuration
file should be set up properly and we need a user with sudo rights. We will use [Certbot](HTTPS://certbot.eff.org/lets-encrypt/ubuntubionic-nginx) 
to add HTTPS to our Archive. 

First ssh into the server you are running your HTTP on using a user with sudo privileges. We the need to run the
following commands to add the Cerbot PPA to our list of repositories 

```bash
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository universe
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
```
Next, we need to install Certbot, run the following command:

```bash
sudo apt-get install certbot python3-certbot-nginx
```

Next, we need to get a certificate and have Cerbot edit our Nginx configuration file and the server it, turning HTTP to 
HTTPS in one step and we can do that with the following command

```bash
sudo certbot --nginx
``` 
Cerbot uses some cronjobs/ systemd timer to renew our certificates automatically before they expire. To see if the
automatic renewal of the certificate works, run the following command:

```bash
sudo certbot renew --dry-run
```
For the SALT/SAAO Data Archive we are using an API, this API uses HTTP, so you will need to edit the .env file and 
change REACT_APP_BACKEND_URI to https:seshat.saao.ac.za/api so as to allow its data through since the website will now
be using  HTTPS. 

To test/ confirm your that your site is properly setup, visit [https://seshat.saao.ac.za](https://seshat.saao.ac.za) and 
in your browser, you will see the lock icon in the URL bar if it worked correctly. 
