# About

A simple blog app built using AWS Amplify.

# How to Deploy

Steps to deploy to AWS Amplify.

1. Create new AWS Amplify App
1. Choose GitHub as Git provider
1. Connect to this repository
1. Choose `journey-2.3` branch
1. Enter `journey-2.3` for the application name
1. Enter `npm run build` for Frontend build command
1. Enter `.next` for Build output directory
1. Save and Deploy

# Components 

This app uses several components:

1. Authentication (Amazon Cognito)
2. Database (Amazon DynamoDB)
3. Storage (Amazon S3)
4. API/GraphQL (AWS AppSync)

Take a look at `amplify/` directory for complete configuration.