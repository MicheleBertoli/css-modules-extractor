import fs from 'fs'
import path from 'path'
import read from 'fs-readdir-recursive'
import postcss from 'postcss'
import modules from 'postcss-modules'

let styles
let map

const filter = file => file.endsWith('css')

const getJSON = source => (cssFileName, json) => {
  const relative = path.relative(source, cssFileName)
  map[relative] = json
}

const store = result => styles.push(result.css)

const process = (source, plugins) => file => {
  const fromPath = path.join(source, file)
  const css = fs.readFileSync(fromPath)

  return postcss(...plugins, modules({ getJSON: getJSON(source) }))
    .process(css, { from: fromPath })
    .then(store)
}

const result = () => ({ styles: styles.join(''), map })

export const extract = (source, ...plugins) => {
  styles = []
  map = {}

  const files = read(source).filter(filter)
  const processes = files.map(process(source, plugins))

  return Promise.all(processes).then(result)
}
