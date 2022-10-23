/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import repo from './repository'
import { commonLocale } from '../../locales'



// async function show(id) {
//   return repo.rawID(id)
// }
async function index(query) {
  return repo.findAll(query)
}



// async function showbyid(id)
// {
//   return repo.findAllByRole(id)
// }

export default { 
  index
  }
