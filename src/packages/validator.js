import validate from 'express-validation'
import audit from './audit/validation'
import category from './category/validation'
import floor from './floor/validation'
import branch from './branch/validation'
import elementType from './elementType/validation'
import location from './location/validation'

function parse(object) {
  const data = {};
  for (const key of Object.keys(object)) {
    data[key] = validate(object[key])
  }
  return data
}

export default {
  category: parse(category),
  audit: parse(audit),
  floor: parse(floor),
  branch: parse(branch),
  elementType: parse(elementType),
  location: parse(location),
}

