# Deploying create-react-app with Nginx and Ubuntu


## Installation
 
SSH into it and update!

```cfml
sudo apt-get update
```

remove apache2 if it is installed
```cfml
sudo apt-get remove apache2
```
Install Nginx
```cfml
sudo apt-get install nginx
```
Install Node.js & npm

We are using the current Stable version of Node.js, which is currently in version 8, but you can install a 
different version by changing the 8 to whatever version you’d like.
```cfml
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs 
```
Install the Yarn package manager
```cfml
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```
Install Git.
```cfml
sudo apt-get install git
```

What setup_8.x does is check whether your operating system version is supported and adds the correct repository. 
This command also installs npm so you don’t have to worry about that.

### Clone your repository on your machine

make directory `/var/www/`. it it doesnt't exist

```cfml
sudo mkdir /var/www
cd /var/www/
```
Since you wouldn’t want to use sudo every time you interact with files in /var/www  let’s give your user privileges to 
these folders. Constantly using sudo increases the chances of accidentally trashing your system.

```cfml
sudo gpasswd -a "$USER" www-data
sudo chown -R "$USER":www-data /var/www
find /var/www -type f -exec chmod 0660 {} \;
sudo find /var/www -type d -exec chmod 2770 {} \;
```
Now that you are inside /var/www and have given your user privileges, let’s clone 
[data-archive-frontend](https://github.com/saltastroops/data-archive-frontend), install dependencies, and build it

```cfml
git clone https://github.com/saltastroops/data-archive-frontend.git
cd data-archive-frontend
sudo npm install
sudo npm run build
```

## Configure Nginx

Configuring Nginx to serve data archive frontend
with Nginx installed
In `/etc/nginx/sites-available/` There will be a template default file and use nano yo edit it.
 ```cfml
nano /etc/nginx/sites-available/default
```
or 
 ```cfml
cd /etc/nginx/sites-available
nano default
```
exchange content in it with:
```text
server {
   listen 80 default_server;
   root /var/www/data-archive-frontend/build;
   server_name [data-archive.domain.com];
   index index.html index.htm;
   location / {
   }
}
```

This allows Nginx to serve data archive frontend at your domain or your IP! index.html will be called first whenever 
data-archive.domain.com/ is accessed.


For more information on configuring Nginx go [here](http://nginx.org/en/docs/beginners_guide.html).

### Starting and restarting Nginx

Now start up Nginx!

```cfml
sudo service nginx start
```

If you changed up your repository or made any changes to the configuration, you can restart Nginx with:

```cfml
sudo service nginx restart
```

## Supervisor.

Starting and restarting Nginx can be done by supervisor


