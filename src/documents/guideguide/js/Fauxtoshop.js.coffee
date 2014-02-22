class window.Fauxtoshop

  data: {}

  # Fauxtoshop is an simulated Photoshop environmennt. It is used for
  # development and demonstration on guideguide.me
  #
  # Returns itself.
  constructor: (args, callback) ->
    args.submitData ||= false
    args.checkForUpdates ||= false

    @data =
      id: 'web'
      name: 'GuideGuide web'
      version: '0.0.0'
      os: @getOS()
      localization: 'en_us'
      env: 'dev'
      guideguideVersion: '0.0.0'
      submitAnonymousData: args.submitData
      checkForUpdates: args.checkForUpdates

    callback() if callback

  # Get saved panel data
  #
  #  callback - code to execute once data has been retrieved
  #
  # Returns nothing
  getData: =>
    data =
      application: @data

  # Add a guide to the document
  #
  #   location    - coordinate position for the guide to be added
  #   orientation - determines horizontal or vertical orientation of the guide
  #
  # Returns false
  addGuide: (location, orientation) =>
    artboardPosition = $('.js-document').find('.js-artboard').position()
    guide = $('.js-templates').find('.js-guide')
    .clone().attr('class','')
    .addClass 'guide js-guide ' + orientation

    if orientation == 'horizontal'
      guide.css 'top', ( location + artboardPosition.top ) + 'px'
    else
      guide.css 'left', ( location + artboardPosition.left ) + 'px'

    $('.js-document').append guide

  # Determine the operating system in which GuideGuide is running
  #
  # Returns a String
  getOS: =>
    os = 'Unknown'
    os = 'MacOS' if navigator.appVersion.indexOf("Mac") >= 0
    os = 'Win' if navigator.appVersion.indexOf("Windows") >= 0
    os = 'UNIX' if navigator.appVersion.indexOf("X11") >= 0
    os = 'Linux' if navigator.appVersion.indexOf("Linux") >= 0
    os
