Datauri = require('datauri')

# Export Plugin
module.exports = (BasePlugin) ->
    # Define Plugin
    class DataURI extends BasePlugin
        # Plugin name
        name: 'datauri'

        # Called per document, for each extension conversion. Used to render one extension to another.
        render: (opts) ->
          # Prepare
          {inExtension, outExtension, file} = opts

          # Upper case the text document's content if it is using the convention txt.(uc|uppercase)
          if outExtension in ['css', null]
            requests = opts.content.match(/data-uri\(['"](.*?)['"]\)/g)

            if requests
              for request in requests
                url = /data-uri\(['"](.*?)['"]\)/g.exec(request)[1]
                cleanedUrl = /.*?\.[\w]+/g.exec(url)[0]
                dir = opts.file.attributes.outDirPath
                dUri = Datauri("#{ dir }/#{ cleanedUrl }")

                uriurl = request.replace(cleanedUrl, dUri).replace('data-uri','url')

                opts.content = opts.content.replace request, uriurl
