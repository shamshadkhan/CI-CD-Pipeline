# Introduction
In software engineering, CI/CD or CICD generally refers to the combined practices of continuous integration and either continuous delivery or continuous deployment. CI/CD bridges 
the gaps between development and operation activities and teams by enforcing automation in building, testing and deployment of applications. The system CI pipeline contains four stages. Each stage is assigned to job as described as below 
- build: this job basically builds the application and brings the application live
- test: this job tests the mandatory api gateway using mocha chai and mock api. This job requires installing npm package and running npm test to test the api.
- eslint: this job performs static analysis on the whole application. This job require installing eslint and running npx eslint for each container.
- deploy: finally deploy the system locally.

# Results
CI/CD Result
![CICD Diagram](/CICD.png "CICD Diagram")
