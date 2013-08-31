# Development

GuideGuide Core is a [Bower](http://bower.io/) package that contains the application independent portion of GuideGuide, specifically the panel UI and API. It does all of the logic, then fires events which each panel can listen for and handle appropriately. The specific panels for each application include the Bower package in their source directories so it can be compiled into them.

GuideGuide is written with [Coffeescript](http://coffeescript.org/) and [Sass](http://sass-lang.com/) and compiled with [DocPad](http://docpad.org/).

## Development server

DocPad runs a server that compiles GuideGuide Core and allows developement in a web browser.

To start the server, open Terminal and run:

```
script/server
```

Then open a browser to `http://localhost:9778/`

## Source files

GuideGuide Core's source files are located in the `src` directory. The various `documents` and `files` directories behave the same as they do [by default](http://docpad.org/docs/overview), except that they've been categorized into `dev` (development server) and `guideguide` (core) folders.

## API

The GuideGuide API, as it were, is made up of events fired on the `$('#guideguide')` element that contain relevant data. GuideGuide panels work by listening for these events and handling this data in the way the application prefers.

For more information about the specific events, see the [Events documentation](events.md).
