/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import _ from 'lodash'
import repo from './repository'
import { commonLocale } from '../../locales'
import * as userClientModule from '../userClient/index'

async function create(body) {
  const category = await repo.findOne({
    CategoryName: body.CategoryName.toLowerCase().trim(),
  })
  if (category) {
    throw new Error(JSON.stringify(commonLocale.dataAlreadyExisted))
  }
  if (body.UserClientIds && body.UserClientIds.length) {
    const created = await repo.create(body)

    Promise.all(body.UserClientIds.map(async (m) => {
      const cate = await userClientModule.service.show(m)
      if (cate) { cate.addCategory(created) }
      return true
    }))

    return created
  }

  return repo.create(body)
}

async function update(id, body) {
  await repo.updateOne({ ID: id }, body)

  if (body.UserClientIds) {
    const data = await show(id)
    const areaIds = data.UserClient ? data.UserClient.map(m => m.Id) : []
    const add = _.difference(body.UserClientIds, areaIds)
    const rem = _.difference(areaIds, body.UserClientIds)
    if (add.length) {
      Promise.all(add.map(async (m) => {
        const cate = await userClientModule.service.show(m)
        return cate.addCategory(data)
      }))
    }
    if (rem.length) {
      Promise.all(rem.map(async (m) => {
        const cate = await userClientModule.service.show(m)
        return cate.removeCategory(data)
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
    elementType.UserClient.map(m => m.removeCategory(elementType))
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
