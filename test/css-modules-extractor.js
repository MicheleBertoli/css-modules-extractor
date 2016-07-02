import fs from 'fs'
import assert from 'assert'

import { extract } from '../src/css-modules-extractor'

const styles = fs.readFileSync('./test/expected/styles.css')
const map = JSON.parse(fs.readFileSync('./test/expected/map.json'))

describe('extract', () => {
  it('works', done => {
    extract('./test/fixtures')
      .then(result => {
        assert.equal(result.styles, styles)
        assert.deepEqual(result.map, map)
      })
      .then(done)
  })
})
