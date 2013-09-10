docpadConfig =
  outPath: 'dev'

  renderPasses: 2

  documentsPaths: [
    'dev/documents',
    'fauxtoshop/documents',
    'components/guideguide-core/src/guideguide/documents',
    'components/adapter-web/src/adapter-web/documents'
  ]

  filesPaths: [
    'dev/files',
    'fauxtoshop/files',
    'components/guideguide-core/src/guideguide/files'
  ]

module.exports = docpadConfig
