/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import _ from 'lodash'
import repo from './repository'
import { commonLocale } from '../../locales'
import * as userClientModule from '../userClient/index'

async function create(body) {
  if (body.UserClientIds && body.UserClientIds.length) {
    const created = await repo.create(body)

    Promise.all(body.UserClientIds.map(async (m) => {
      const cate = await userClientModule.service.show(m)
      if (cate) { cate.addElement(created, { through: { ElementClientStatus: true } }) }
      return true
    }))

    return created
  }

  return repo.create(body)
}

async function update(id, body) {
  await repo.updateOne({ Id: id }, body)

  if (body.UserClientIds) {
    const data = await show(id)
    const areaIds = data.UserClient ? data.UserClient.map(m => m.Id) : []
    const add = _.difference(body.UserClientIds, areaIds)
    const rem = _.difference(areaIds, body.UserClientIds)
    if (add.length) {
      Promise.all(add.map(async (m) => {
        const cate = await userClientModule.service.show(m)
        return cate.addElement(data, { through: { ElementClientStatus: true } })
      }))
    }
    if (rem.length) {
      Promise.all(rem.map(async (m) => {
        const cate = await userClientModule.service.show(m)
        return cate.removeElement(data)
      }))
    }
    return data
  }

  return show(id)
}

async function index(query) {
  return repo.findAll(query)
}

async function show(id) {
  return repo.findById(id)
}

async function destroy(id) {
  const elementType = await repo.findById(id)
  if (elementType && elementType.UserClient && elementType.UserClient.length) {
    elementType.UserClient.map(m => m.removeElement(elementType))
  }
  return repo.destroy(id)
}

export default {
  create,
  index,
  show,
  update,
  destroy
}
