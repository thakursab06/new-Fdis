import { AreaSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'


async function findById(id) {
  return AreaSeq.findByPk(id)
}

async function findOne(query) {
  return AreaSeq.findOne({
    where: {
      ...query
    }
  });
}

async function create(body) {
  return (await AreaSeq.create(body)).get({ plain: true })
}

async function updateOne(query, body) {
  return AreaSeq.update(body, { where: { ...query } })
}

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return AreaSeq.findAndCountAll({
    where: condition,
    ...option,
    attributes:
    {
      exclude: request.excludes,
      include: request.includes
    }
  })
}

async function countDocuments(query) {
  return AreaSeq.count(query)
}

const destroy = async (id) => {
  return AreaSeq.destroy({ where: { ID: id } })
}





export default {
  findById,
  findAll,
  create,
  findOne,
  updateOne,
  countDocuments,
  destroy
}
