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

#### Github actions

GitHub Actions help you automate your software development workflows in the same place you store code and collaborate on
 pull requests and issues.
 
 To execute GitHub Actions, you must define a workflow for configurable automated process for compiling, building, 
 testing, packaging, delivering or deploying data archive right on GitHub.
 
 A workflow contains actions, which are the actual processes to be carried out. In order for GitHub to know about any 
 defined workflow, in your repository root directory, there must be a `.github/workflow/` directory.
 
 Inside the `workflow/` directory you may define `*.yml`  files, which are the actual workflow configuration files.
```yaml
# The Data Archive Frontend Development Workflow
name: Data Archive Frontend Development Workflow

# This workflow is triggered whenever there are new commits pushed to the development branch.
on:
  push:
    branches:
      - development

jobs:
  job1:
    # The job for building and testing the code inside the github virtual machine.
    name: Build and test the app on the github virtual machine
    # This job is executed on the Linux machine.
    runs-on: ubuntu-latest

    # The matrix strategy is used to specify the nodejs version to use for the node packages management.
    strategy:
      # In this case, nodejs version 10.x is used.
      # To include more versions, you add them as follows: [8.x, 10.x, 12.x, ...].
      matrix:
        node-version: [10.x]

    # The steps to be executed for this job.
    steps:
      # This step uses the checkout action to make sure the latest code is used.
      - name: Use the latest code
        uses: actions/checkout@v1
      # This step uses the setup-node action to setup the nodejs environment.
      - name: Setup the nodejs environment
        uses: actions/setup-node@v1
        # The setup-node action accepts parameters.
        # In this case, the nodejs version parameter specifying the version of nodejs to use is supplied.
        with:
          node-version: ${{ matrix.node-version }}
      # This specifies the commands to run after the build is done.
      # The first command is for installing the nodejs packages.
      # The second command is for typescript linting.
      # The third command is for executing the tests.
      - run: |
          yarn install
          yarn lint
          yarn test:ci
        shell: bash

```

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

Errors are monitored [Sentry](https://sentry.io/welcome/) if the environment variable `REACT_APP_SENTRY_DSN` is set in the environment file (see the section on setting up environment variables).

### Installing and configuring nginx

Start by installing yarn.

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

This will also install node.

Make sure that Apache2 is not installed, remove it if it is installed

```bash
sudo apt-get remove apache2
``` 

Then install nginx.

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
IT can help in setting up the above file making the server a secure server by making uri https.

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
git clone https://github.com/saltastroops/data-archive-frontend.git /var/www/frontend
```

Then checkout the correct branch.

```bash
cd /var/www/frontend
git checkout master
```
Note: You must use development branch for development server

Then carry out the steps described in the section on updating the code.

### Updating the code on the server

Navigate to the code directory,and pull the latest version of the code from the repository.

```bash
cd /var/www/frontend

git pull 
```

Install all the dependencies,

```bash
yarn install
```

Remove current build folder if it exists, and build the project.

```bash
rm -r build

yarn build
```

If necessary, restart nginx,

```bash
sudo service nginx restart
```

Or reboot the server.

```bash
sudo reboot
```

The above steps are explained in detail [in this article](https://medium.com/@timmykko/deploying-create-react-app-with-nginx-and-ubuntu-e6fe83c5e9e7).

