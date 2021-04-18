# References Matrix App

The References Matrix App creates a repeatable list of associated references in the Contentful web app.

## Example Data structure

The References Matrix App utilizes the Contentful [JSON Field](https://www.contentful.com/developers/docs/concepts/data-model/#:~:text=JSON%20Object) to store a simple `Array` data stucture of multiple referneces id:

```json
[
  {
    "contentTypeId1": "string",
    "contentTypeId2": "string"
  },
  {
    "contentTypeId1": "string",
    "contentTypeId2": "string"
  }
]
```

## Setup for Usage in Contentful

(1) Build your app with `$ npm run build` and host the files found in `./build/` somewhere statically.

(2) In your Contentful account, create a new private app. Give it a name and enter the URL that points to the hosted version of your `./build/` directory.

(3) Under "Location", check "Entry field" and "JSON Object"

(4) Under "Instance Parameter Defintions", add two instance parameters with the following IDs, each of them of type "Short text":

- `contentTypesIds `
- `titleFieldIds `

(5) Save the app and install it to the space(s) you like.

(6) When you add or edit a JSON Object field in your content model, you should now see your app in the "Appearance" tab, along with fields for the instance parameters you configured. Fill them out as follows:

| Parameter         | Description                                                                           | Default |
| ----------------- | ------------------------------------------------------------------------------------- | ------- |
| `contentTypesIds` |  a comma separated list of content types (id) that can be associated                  |  `""`   |
| `titleFieldIds`   |  a comma separated list of entry title fields (id) of each content types listed above |  `""`   |

## Development

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.

Open your app to view it in the browser.

The page will reload if you make edits.

You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

## More about Contentful Apps

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

Create Contentful App uses [Create React App](https://create-react-app.dev/). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and how to further customize your app.
