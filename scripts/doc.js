const path = require('path')
const fs = require('fs')
const docs = path.resolve(__dirname, '..', 'docs')
const classes = path.resolve(docs, 'classes')


const result = fs.readdirSync(classes)
const text = result.map(filename => (
  `[${filename.split('.')[0]}](classes/${filename})`
)).join('\n')

fs.writeFileSync(path.resolve(docs, 'SUMMARY.md'), text)
