import { pick } from 'lodash'
import { handleResponse } from '../../utils/handle-response'
import to from '../../utils/to'
import service from './service'
import config from './config'


async function  uploadImage(req, res) {
  const [error, result] = await to(service.uploadImage(req.file,req.body))
  return handleResponse(error, result, req, res)
}


export default {
  
  uploadImage
}
