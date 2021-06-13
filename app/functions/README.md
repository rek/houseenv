# Firebase functions for House env system.

## Usage deps:

```
npm -g i firebase-tools
```

## Then build and deploy:

```
yarn build && yarn deploy
```

## Functions here:

- auth

## Get the auth/login functions to work (without initial auth)

You need to add 'Cloud Functions Invoker' to 'allUsers' for that function.

Steps here: https://lukestoolkit.blogspot.com/2020/06/google-cloud-functions-error-forbidden.html

## Then enable homegraph and the api.

- From console enable homegraph api for your project eg:

https://console.developers.google.com/apis/api/homegraph.googleapis.com/overview?project=<<project id>>
