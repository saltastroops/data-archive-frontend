# SAAO/SALT Data Archive frontend

This project provides the web frontend for using the SAAO/SALT Data Archive.

## Setting up for development

### Step 1: Getting started

#### Cloning the code 

To clone this repository to your development machine, you need to run the following command (assuming that `git` is installed on your machine.

```bash
git clone https://github.com/saltastroops/data-archive-frontend.git frontend
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
 

## Deployment

Deployment Error tracking will will be monitored by Sentry, given that environment variable `REACT_APP_SENTRY_DSN` is set. 
Learn more about [sentry here](https://sentry.io/welcome/).

### install and configure nginx

Make sure that Apache2 is not installed
```bash
sudo apt-get remove apache2
``` 

and the install nginx
```bash
sudo apt-get install nginx
```

Update nginx site available default 
```bash
sudo nano /etc/nginx/sites-available/default
```

and add the code below
```text
server {
   listen 80 default_server;
   root /var/www/frontend/build;  # path to the build directory for your project
   server_name xxxxx/;  # server name e.g mywebsite.saao.ac.za
   index index.html index.htm;
   location / {
   }
}
```

Create a symbolic link between sites available and sites enabled
```bash
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
```

start nginx service
```bash
sudo service nginx start
```

If nginx service is running you can restart nginx service by
```bash
sudo service nginx restart
```

### Updating code on the server

Login the server and navigate to code.

```bash
cd /var/www/frontend
```
Use git to pull correct branch

```bash
git checkout .
git checkout development
git pull 
```

Install all the dependency
```bash
yarn install
```
remove current build folder if it exist
```bash
rm -r build
```
And build the project
```bash
yarn build
```

If necessary restart nginx or reboot server
```bash
sudo service nginx restart
    or
sudo reboot
```

All of the above steps are explained properly on [link](https://medium.com/@timmykko/deploying-create-react-app-with-nginx-and-ubuntu-e6fe83c5e9e7)

