/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import repo from './repository'
import { commonLocale } from '../../locales'

async function create(body) {
  console.log('Service',body)
  return repo.create(body)

}

// async function update(id,body) {
//   console.log(id,body),
//   await repo.updateOne(id,body)

//   // return show(id)
// }
async function update(id,body) {
  await repo.updateOne(id,body)
  console.log(id,body)
    return show(id)
}

async function index(query) {
  return repo.rawQueryList(query)
}

async function show(id) {
  return repo.findById(id)
}

async function destroy(id) {
  return repo.destroy(id)
}

async function showbyid(id)
{
  return repo.findAllByRole(id)
}
export default {
  create,
  index,
  show,
  update,
  destroy,
  showbyid
}
