# Development

Fauxtoshop is a [Bower](http://bower.io/) package that contains html, scss, and coffeescript to generate a fake Application to demo GuideGuide. It is intended to be embedded in the GuideGuide website and development environments and not stand on it's own.

Fauxtoshop is written with [Coffeescript](http://coffeescript.org/) and [Sass](http://sass-lang.com/) and compiled with [DocPad](http://docpad.org/).

## Development server

DocPad runs a server that compiles Fauxtoshop and allows developement in a web browser.

To start the server, open Terminal and run:

```
script/server
```

Then open a browser to `http://localhost:9778/`

## Source files

Fauxtoshop's source files are located in the `src` directory. The various `documents` and `files` directories behave the same as they do [by default](http://docpad.org/docs/overview), except that they've been categorized into `dev` (development server) and `fauxtoshop` folders.
