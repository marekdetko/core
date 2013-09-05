# Development

The GuideGuide web adapter [Bower](http://bower.io/) package that contains the class that extends GuideGuide Core to work in a browser. This is included in places like Fauxtoshop and the development environment for GuideGuide Core.

The web adapter is written with [Coffeescript](http://coffeescript.org/) and compiled with [DocPad](http://docpad.org/).

## Development server

DocPad runs a server that compiles the GuideGuide web adapter and allows developement in a web browser.

To start the server, open Terminal and run:

```
script/server
```

Then open a browser to `http://localhost:9778/`

## Source files

The web adapter's source files are located in the `src` directory. The various `documents` and `files` directories behave the same as they do [by default](http://docpad.org/docs/overview), except that they've been categorized into `dev` (development server) and `adapter-web` folders.
