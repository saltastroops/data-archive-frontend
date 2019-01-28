# Setting up for development

Clone from [github](https://github.com/Eb-Zeero/da-frontend)

## Step 1: Getting started

### Cloning the code 

To clone the data archive frontend code to your development machine, you need to run the following command given that 
you have `git` installed on your machine

```cfml
git clone https://github.com/Eb-Zeero/da-frontend.git

```

A directory of name `da-frontend` having the frontend code will be created.

To start run the current or cloned progress of the frontend you have to run 

```cfml
cd da-frontend
yarn install
yarn start

```
On the terminal or command line given that you have nodejs installed globally on the development machine

### Git

Development is done on the main repository created by saltastoops who will never modify or commit the code. Other 
collaborators to the repository will only be allowed to commit to new branch they created which in not development 
branch or main branch.
 
Push this branch to Github, making sure that it is pushed to a branch of the same 
name.

Make a pull request from the branch to development in Github.

Someone else checks the pull request

That person may pull the branch to their own machine, fix obvious errors, commit their changes and make a new pull 
request.

Once work on a branch other than master or development is done, delete it both 
locally and on Github.

All pull request to the development should be version.

### Travis cli

Once you do a git push travis will automatically be triggered to run.
It will clone the repository and run `yarn install` on the root directory after all dependency are installed it will run
`yarn run lint` to check all the linting of the code and finally run `yarn test` to run all the tests in the project. 
 
Make sure you check travis after sometime to insure that all the linting is fine and tests are passing.
If travis is failing, please fix all the linting and/or test and commit all changes and  push to the same branch as before.

## Step 2: Setting up environment variables

### GraphQL

```text
REACT_APP_GQL_ENDPOINT=graphQL api endpoint 
```
This environment variables should be added to accordingly

For development it should be added on `.env.development` and the value should be development value.
For testing it should be added on `.env.test` and the value should be testing value and.
For production it should be added on `.env.production` and the value should be production value.
 


### Sentry env
This environment variables should be added to the `.env.production` file only.

```text
REACT_APP_SENTRY_DSN = Sentry DSN for the application
```
Do not include the the Sentry environment variable on `.env` file. Because Sentry should only run on production not 
during development and testing.

### Other 

Other environment variable should be added starting with `REACT_APP_` so that they can be picked up automatically by 
react.
there are four files `.env, .env.development, .env.production` and `.env.test` as the file names suggest 
- `.env` is for general environment variable.
- `.env.test` is for testing environment variable.
- `.env.development` is for development environment variable.
- `.env.production` is for production environment variable.

## Step 3: Running and testing the application

To run the application use command `yarn start` on the root directory of this project.
To run all the tests of this application use command `yarn test` on the root directory of this project.
 

# Deployment

{ Deployment steps to follow below. }

Deployment Error tracking will will be monitored by Sentry.
learn more about [sentry here](https://sentry.io/welcome/).

# Packages.

## Application

React
Apollo
Bulma

## Development
## Testing

