/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
import repo from './repository'
import { commonLocale } from '../../locales'


async function uploadImage(file) {
  return repo.uplode(file)
}



export default {
  uploadImage
}
