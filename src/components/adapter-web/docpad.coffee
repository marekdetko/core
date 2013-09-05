docpadConfig =
  outPath: 'dev'

  renderPasses: 2

  documentsPaths: [
    'components/fauxtoshop/src/fauxtoshop/documents',
    'components/guideguide-core/src/guideguide/documents',
    'adapter-web/documents',
    'dev/documents'
  ]

  filesPaths: [
    'components/fauxtoshop/src/fauxtoshop/files',
    'components/guideguide-core/src/guideguide/files',
    'adapter-web/files',
    'dev/files'
  ]

module.exports = docpadConfig
