import { useEffect, useState } from 'react';
import { StyledTable, Container } from '../../Table/Table.Styled'
import { EditOutlined } from '@mui/icons-material';

const RebarTable = () => {
  const detailingTimesheet = ['S.NO', 'Job study/RFI', 'Outline', 'New detailing', 'Shop drawing checking', 'Back from approval', 'Change order preparation', 'Change order revisions', 'Barlisting', 'Job meetings', 'Job coordination']
  const estimationalTimesheet = ['S.NO', 'Job study/RFI', 'Outline', 'New detailing', 'Shop drawing checking', 'Back from approval', 'Change order preparation', 'Change order revisions', 'Barlisting', 'Job meetings', 'Job coordination']
  const dimentionalTimesheet = ['S.NO', 'Job study/RFI', 'Outline', 'New detailing', 'Shop drawing checking', 'Back from approval', 'Change order preparation', 'Change order revisions', 'Barlisting', 'Job meetings', 'Job coordination']

  const [isEdit, setIsEdit] = useState(false)
  const [cols, setCols] = useState(detailingTimesheet)

  useEffect(() => {
    fetchTableData()
  }, [])

  const fetchTableData = () => {
    let data = {timesheet:'detailingTimesheet'}
    data.timesheet=='detailingTimesheet'?setCols(detailingTimesheet):data.timesheet=='estimationalTimesheet'?setCols(estimationalTimesheet):setCols(dimentionalTimesheet)
  }


  return (
    <div style={{ overflowX: "auto" }} >
      <StyledTable>
        <thead>
          <tr>
            <th><input type="checkbox"></input> </th>
            {cols.map((col) => {
              return <th>{col}</th>
            })}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td onClick={() => setIsEdit(prev => !prev)} style={{ cursor: "pointer" }}>
              <EditOutlined />
            </td>
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>1</td>}
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>22/22/22</td>}
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>22/22/22</td>}
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>22/22/22</td>}
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>22/22/22</td>}
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>22/22/22</td>}
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>22/22/22</td>}
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>22/22/22</td>}
            {isEdit ? <td className='rebar_edit' ><input defaultValue="22/22/22	" type='text' /></td> : <td>22/22/22</td>}
          </tr>
        </tbody>
      </StyledTable>
    </div>
  )
}

export default RebarTable
