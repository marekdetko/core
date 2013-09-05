docpadConfig =
  outPath: 'dev'

  renderPasses: 2

  documentsPaths: [
    'dev/documents',
    'guideguide/documents',
    'components/adapter-web/src/adapter-web/documents',
    'components/fauxtoshop/src/fauxtoshop/documents',
  ]

  filesPaths: [
    'dev/files',
    'guideguide/files',
    'components/fauxtoshop/src/fauxtoshop/files',
  ]

module.exports = docpadConfig
