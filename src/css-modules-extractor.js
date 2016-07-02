import fs from 'fs'
import path from 'path'
import read from 'fs-readdir-recursive'
import postcss from 'postcss'
import modules from 'postcss-modules'

const styles = []
const map = {}

const filter = file => file.endsWith('css')

const getJSON = source => (cssFileName, json) => {
  const relative = path.relative(source, cssFileName)
  map[relative] = json
}

const store = result => styles.push(result.css)

const process = source => file => {
  const from = path.join(source, file)
  const css = fs.readFileSync(from)

  return postcss(modules({ getJSON: getJSON(source) })).process(css, { from }).then(store)
}

const result = () => ({ styles: styles.join(''), map })

export const extract = source => {
  const files = read(source).filter(filter)
  const processes = files.map(process(source))

  return Promise.all(processes).then(result)
}
