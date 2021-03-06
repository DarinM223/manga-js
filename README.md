manga-js
========

A desktop manga reader in Javascript using React and Redux.

[![Build Status](https://travis-ci.org/DarinM223/manga-js.svg?branch=master)](https://travis-ci.org/DarinM223/manga-js)

## Features

* Many manga apps only allow you to read a small portion of manga from a given site. With this app you can add any manga available from a supported manga site by pasting in the URL.
* You can download as many chapters as you want for offline reading.
* Because the download state is persisted to disk you can close the app while it is downloading a chapter and it will resume the next time you start it up again.
* The app automatically checks for and adds new chapters on startup.
* You can navigate to the next/previous page by clicking the right/left side of the manga image. You can also jump directly to a certain page or use a slider to scroll quickly through pages.

![Screenshot](/screenshot.png)

## Running

In order to build and run manga-js, you have to first have npm installed. Then run `npm install` in the project directory to install the dependencies.

If you want to run manga-js in development mode you can just run `npm start`.

If you want to build the packaged electron app you should run `npm run build` to compile the front end Javascript and
then run either `npm run package-mac` `npm run package-windows` or `npm run package-linux` to package the app.
The packaged app will be in the release-builds folder.
Because the app will always try to use the compiled Javascript bundle over the normal code, if you want to go back into development mode you have to
remove the build/bundle.js file created from `npm run build`.

## Supported sites

Right now the only supported sites are mangareader.net and mangafreak.net. However, I plan on adding support for more manga sites in the future and it is also fairly easy to contribute bindings to a specific site.

## Contributing

Contributions for all parts of the application are welcome! The easiest contribution to make is adding support for a specific manga site. In order to do that, you should create a new file inside utils/sites and have it implement the functions mangaURL, sendRequest, parseMangaData, parsePageLinks, and parsePageImage (look at utils/sites/mangareader.js for an example). Then all you have to do is add a key-value pair to the hostnameAdapterMap object inside utils/url.js where the key is the hostname of the new manga site and the value is require('path to file you created').

The style checker for this project is [standard](https://github.com/feross/standard) so you should make sure that running standard in the project root doesn't result in any errors or warnings.

## Testing

To run the jest tests, run `npm test`.
