/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import _ from 'lodash'
import repo from './repository'
import { commonLocale } from '../../locales'
import * as categoryModule from '../category/index'

async function create(body) {
  if (body.CategoryIds && body.CategoryIds.length) {
    const created = await repo.create(body)

    Promise.all(body.CategoryIds.map(async (m) => {
      const cate = await categoryModule.service.show(m)
      if (cate) {
        cate.addAreaDescription(created, { through: { AreaDescModuleId: created.ModuleId } })
      }
      return true
    }))

    return created
  }

  return repo.create(body)
}

async function update(id, body) {
  await repo.updateOne({ Id: id }, body)

  if (body.CategoryIds) {
    const data = await show(id)
    const areaIds = data.Category ? data.Category.map(m => m.ID) : []
    const add = _.difference(body.CategoryIds, areaIds)
    const rem = _.difference(areaIds, body.CategoryIds)
    if (add.length) {
      Promise.all(add.map(async (m) => {
        const cate = await categoryModule.service.show(m)
        return cate.addAreaDescription(data, { through: { AreaDescModuleId: data.ModuleId } })
      }))
    }
    if (rem.length) {
      Promise.all(rem.map(async (m) => {
        const cate = await categoryModule.service.show(m)
        return cate.removeAreaDescription(data)
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
  if (elementType && elementType.Category && elementType.Category.length) {
    elementType.Category.map(m => m.removeAreaDescription(elementType))
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
