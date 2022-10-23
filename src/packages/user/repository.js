import { UserSeq } from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'


async function findById(id) {
  return UserSeq.findByPk(id, {
    include: ['UserClient']
  })
}

async function findOne(query) {
  return UserSeq.findOne({
    where: {
      ...query
    },
    include: ['UserClient']
  });
}

async function create(body) {
  return UserSeq.create(body)
}

async function updateOne(query, body) {
  return UserSeq.update(body, { where: { ...query } })
}

const findAll = async (request) => {
  const condition = queryBuilderGetList(request)
  const option = listInitOptions(request)
  option.raw = undefined
  return UserSeq.findAndCountAll({
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
  return UserSeq.count(query)
}

const destroy = async (id) => {
  return UserSeq.destroy({ where: { Id: id } })
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
