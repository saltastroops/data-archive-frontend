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
git clone https://github.com/saltastroops/data-archive-frontend.git /var/www/frontend
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

The above steps are explained in detail [in this article](https://medium.com/@timmykko/deploying-create-react-app-with-nginx-and-ubuntu-e6fe83c5e9e7).

### Adding Brotli to the SAAO/SALT Data Archive

For this Data Archive, since we are using Nginx, we will used ngx_brotli, which is developed and supported by Google. 
A pre-requisite is that you must already have HTTPS on the server from a trusted source such as [Let's Encrypt](https://certbot.eff.org/)

When your serever has HTTPS and Nginx working, we can now add Brotli. For this to work, you’ll need to compile Brotli 
using the correct version of Nginx installed. 

First, install required libraries by running the commands below.

```bash
sudo apt install git libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev
```
After that,you need to check the current Nginx version using the command below:
```bash
sudo nginx -v
``` 
Next, download Nginx that matches the current installed version (which is what we just checked). Then extract it using 
the commands below:
```bash
cd ~/
wget https://nginx.org/download/nginx-version.tar.gz
tar zxvf nginx-1.16.1.tar.gz
```
Replace 'version' with your current Nginx version
After extracting it, go and clone ngx_brotli module from Github using the commands below:
```bash
cd ~/
git clone https://github.com/eustas/ngx_brotli.git
cd ~/ngx_brotli
git submodule update --init
```
We then need to go into Nginx folder on our home page using the following condition:
```bash
cd ~/nginx-version
```
Replace 'version' with your current Nginx version.

Then we need to install the following modules:

```bash
sudo apt-get install libxslt-dev
sudo apt-get install libgd-dev # for the "error: the HTTP image filter module requires the GD library." error
sudo apt-get install libgeoip-dev # for the GeoIP package
```
Next we need to run the following command:
```bash
nginx -V
```
From the output of the command above, you might get something similar to this:
```text
nginx version: nginx/1.14.0 (Ubuntu)
built with OpenSSL 1.1.1  11 Sep 2018
TLS SNI support enabled
configure arguments: 
```
The most import part of the output here is the 'configure arguments', we must copy everything after 'configure arguments'.
We then run the following command:
```bash
./configure --add-dynamic-module=../ngx_brotli configure arguments
```
We need to replace 'configure arguments' with what we copied from the nginx -V command,after that press enter.
Example: ./configure --add-dynamic-module=../ngx_brotli --prefix=/usr/share/nginx. Of course yours will differ but the 
procedure is the same.

We then run the following commands:

```bash
make modules
sudo cp objs/*.so /etc/nginx/modules-available
sudo cp objs/*.so /usr/share/nginx/modules
```  
List files in /etc/nginx/modules-available and you will see:

```text
ngx_http_brotli_filter_module.so
ngx_http_brotli_static_module.so
```
Now we are ready to load ngx_brotli module. We first run the following command:
```bash
sudo nano /etc/nginx/nginx.conf
```
We then add the following lines at the top of the file:
```bash
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
```
Your nginx.conf file should look similar to this:
```text
load_module modules/ngx_http_brotli_filter_module.so;
load_module modules/ngx_http_brotli_static_module.so;
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 768;
        # multi_accept on;
}
```
After that, run Nginx test to see if you get any errors, by using the following command:
```bash
sudo nginx -t
```

You should get output similar to the following if everything has gone well:
```bash
Output:
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
With Let's Encrypt having added its own information in the file /etc/nginx/sites-available/. You now need to add the 
following lines to the same file but not on the last server block:

```text
brotli on;
brotli_static on;
brotli_types *;
```
The Nginx configuration file should now look similar to the following:

```text
server {
    server_name  your_server_name;

    location / {
        root /var/www/frontend/build;
        index index.html index.htm;
        try_files $uri /index.html;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/seshat.saao.ac.za/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/seshat.saao.ac.za/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    brotli on;
    brotli_static on;
    brotli_types *;
}
```
Next step is to restart Nginx with this command:
```bash
sudo systemctl reload nginx.service
```
That should do it!

If you want to see if Brotli is now working properly, you can use [BROTLI PRO](https://www.brotli.pro/)
