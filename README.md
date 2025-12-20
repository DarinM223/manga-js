# manga-ts

A desktop manga reader using React and Redux.

## Features

- Many manga apps only allow you to read a small portion of manga from a given site. With this app you can add any manga available from a supported manga site by pasting in the URL.
- You can download as many chapters as you want for offline reading.
- Because the download state is persisted to disk you can close the app while it is downloading a chapter and it will resume the next time you start it up again.
- The app automatically checks for and adds new chapters on startup.
- You can navigate to the next/previous page by clicking the right/left side of the manga image. You can also jump directly to a certain page or use a slider to scroll quickly through pages.

![Screenshot](/screenshot.png)

## Running

In order to build and run manga-ts, first have pnpm installed. Then run `pnpm install` in the project directory to install the dependencies.

If you want to run manga-ts in development mode you can just run `pnpm dev`.

If you want to build the packaged electron app you should run `pnpm build` to compile the front end Javascript and then `pnpm build:linux` to package the code into an executable where `linux` can
be replaced with your platform.

## Supported sites

Right now there are no supported sites because the way to bypass Cloudflare constantly changes. However, I plan on adding support for some manga sites in the future and it is also fairly easy to contribute bindings to a specific site.

## Contributing

Contributions for all parts of the application are welcome! The easiest contribution to make is adding support for a specific manga site. In order to do that, you should create a new file inside utils/sites and have it implement the functions mangaURL, sendRequest, parseMangaData, parsePageLinks, and parsePageImage (look at utils/sites/preloaded.ts for an example). Then all you have to do is add a key-value pair to the hostnameAdapterMap object inside utils/url.ts where the key is the hostname of the new manga site and the value is require('path to file you created').

## Testing

To run the vitest tests, run `pnpm test`.
