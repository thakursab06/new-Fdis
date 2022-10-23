import repo from './repository'
import { commonLocale } from '../../locales'
import userClientRepo from '../userClient/repository'

async function create(body) {
  return repo.create(body)
}

async function update(id, body) {
  await repo.updateOne({ ID: id }, body)
  return show(id)
}

async function index(query) {
  return repo.findAll(query)
}

async function show(id) {
  return repo.findById(id)
}

async function destroy(id) {
  return repo.destroy(id)
}

async function indexJoin(query) {
  return userClientRepo.findAllJoin(query)
}

async function locationbyclient(body){
  return repo.findAllLocations(body)
}

export default {
  create,
  index,
  show,
  update,
  destroy,
  indexJoin,
  locationbyclient
}
