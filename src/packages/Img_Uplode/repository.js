import {ImgSeq} from '../../models';
import {Sequelize}from 'sequelize'
import method from './method'
import { commonLocale } from '../../locales'
const jwt = require('jsonwebtoken');
const multer = require('multer')
import UplodeImg from './imgUplode'
const fs = require('fs')
const path = require('path');
const { uploadFile, getFileStream } = require('./imgUplode')

const uplode = async(file)=>{
   const fileStream = fs.createReadStream(file.path)
   const file_original = file.originalname
   const Extention=path.extname(file_original);
   const Mimetype=file.mimetype;
   const ImageDataLocation=file.filename+`${Extention}`
   const uplode = await uploadFile(file)
   const raw=`INSERT INTO [dbo].[Images]([ImageDataLocation],[ImageMimeType])VALUES ('${ImageDataLocation}','${Mimetype}')  
   `;
   const resoonse =  await ImgSeq.sequelize.query(raw, {
    replacements:[''],
    type: Sequelize.QueryTypes.INSERT
   })
   const select=`SELECT ImageId FROM [dbo].[Images] WHERE [ImageDataLocation]='${ImageDataLocation}'`
   const result =  await ImgSeq.sequelize.query(select, {
    replacements:[ImageDataLocation],
    type: Sequelize.QueryTypes.SELECT
   })
   //console.log(result[0].ImageId)
   return result[0].ImageId;
}
export default {
  uplode,
}
