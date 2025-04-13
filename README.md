# Custom Roles Testing

These are a bunch of scripts to add data to a running ES stack to test custom roles and permissions, primarily against observability alerting use cases.

## How to use

* Make sure you have the following local dependencies
  - Docker Desktop
  - nodejs
  - npm
  - yarn
  - npx
* Get Docker running locally
* Check out this repo locally
  - Copy the .env.example file to .env
  - Run `npm install` in this directory

**Switch to your local Kibana checkout directory.**

* Check out my branch in the Kibana repo, then from inside that directory:
  - Use yarn to run ES with correct flags (serverless)
  ```shell
  $ yarn es serverless --projectType=oblt -E xpack.security.authc.native_roles.enabled=true
  ```
  - Use yarn to run Kibana with correct flags
  ```shell
  $ yarn start --serverless=oblt --xpack.security.roleManagementEnabled=true --xpack.cloud.users_and_roles_url="https://test_users_and_roles_url"
  ```
* Log into running Kibana UI (choose "admin" as your user if running in serverless mode)
  - Go to Project settings > Management > API Keys and make a new API key with default settings, no changes needed, copy that API key value (Base64 encoded already) into the .env file you copied above, as the ES_API_KEY value
  - Navigate to the observability app pages and you should see all of the "Add data" screens
  - `/app/observability/alerts` should show no alerts
  - `/app/observability/alerts/rules` should show no rules

**Back in this repo checkout directory...**

* In your command shell, run:  
```shell
$ source ./.env
```
* Confirm that the variables have loaded and you can connect to ES and Kibana via scripts:
```shell
$ npx ts-node ./bin/test_connections.ts
```
* Load the alerting rules and data views
```shell
$ npx ts-node ./bin/create_rules.ts
```
* You should see these new rules created in the `/app/observability/alerts/rules` page now (some may be failing due to lack of data in the targeted indices, that's okay for a minute)
* Load the sample data
```shell
$ npx ts-node ./bin/push_docs.ts
```
* Now you should be able to navigate most of the observaiblity UI without seeing the "Add data" screens
* Within about a minute, you should have an active alert for all of the running rules, and all of the former rule errors should have cleared.
