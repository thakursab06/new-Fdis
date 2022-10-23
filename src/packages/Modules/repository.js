import { ErrorCategory } from '../../models';
import { Modules } from '../../models';
import { Sequelize } from 'sequelize';
import { UserSeq,SuperPerformer} from '../../models';
import { queryBuilderGetList } from './query-builder'
import { listInitOptions } from '../../utils/paginate'
import method from './method'

import{ Table } from 'mssql';

async function findAll(query) {
  const raw='SELECT  * FROM [dbo].[Modules]'
  return Modules.sequelize.query(raw, {
    replacements:[],
    type: Sequelize.QueryTypes.SELECT
   })

}

export default {

findAll  
 
}
