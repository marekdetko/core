# GuideGuide Core

GuideGuide is a guide management plugin designed to easy to embed in multiple applications. GuideGuide Core is a [Bower](http://bower.io/) package of scripts, styles, and markup that controls GuideGuide's UI and API.

**GuideGuide is currently under development and is undocumented. I will not be offering development support until GuideGuide officially ships, at which time I will remove this notice**

**GuideGuide is a project by which I experiment and learn about development practices. The code can be ugly at times. If I'm not following some sort of best practice that you think I should be, I'll happily accept pull requests improving the code/performance, assuming I agree that it is an improvement. For example, the codebase is currently an awkward mix of sync and async. I know it's gross and I hope to refactor it at some point :)**

**GuideGuide is open source to help improve the codebase. Once GuideGuide 3 has shipped, I will do my best to follow best practices for semver support and releases, but I make no promises**.

## Setup

### OSX

1. [Download & Install Git](http://git-scm.com/download)

2. [Download & Install Xcode](http://developer.apple.com/xcode/)

  Once installed, install the command line tools. You can find them in Xcode at

  `Preferences > Downloads > Command Line Tools > Install`

3. Install [Node.js](http://nodejs.org/)

4. Bootstrap everything in Terminal.

  ```
  sudo script/bootstrap
  ```

### Windows

You need to have [Git](http://git-scm.com/download), [Ruby](http://www.rubyinstaller.org/),
and [Node](http://nodejs.org/) installed on your system.

1. Install SASS compiler
  ```
  gem install sass
  ```
2. Install dependencies
  ```
  npm install
  ```

## Usage

1. Run the server.

  ```
  script/server
  ```

2. Open `http://localhost:9778/` in a browser.
