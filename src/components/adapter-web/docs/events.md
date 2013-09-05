# Events API

The GuideGuide API, as it were, is made up of events fired on the `$('#guideguide')` element. GuideGuide panels work by listening for these events and handling this data in the way the application prefers.

```
$(document).on 'guideguide:ready', '#guideguide', (event) ->
  console.log 'GuideGuide is ready!'
```

The events below are the relevant events for app adapter <-> GuideGuide communication. GuideGuide contains other events, but they are only documented in the code, as they are not likely to be used by 3rd party developers.

## Core -> Application

GuideGuide application adapters listen to these events from GuideGuide Core.








I've changed my mind. Don't do this event based stuff.









- `guideguide:clearGuides`

- `guideguide:addGuides`

  `data`: An array of guide objects, example: `{"location":20, "orientation":"vertical"}`

## Application -> Core

GuideGuide Core listens for these events from GuideGuide application adapters.

- `guideguide:ready`

  Fired by an GuideGuide panel after the application adapter has been loaded. 

- `guideguide:updateTheme`

  Fired when the host application changes theme. Used to switch GuideGuide's color theme.