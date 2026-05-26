import { StyledTable, Container } from '../Table/Table.Styled'
import { EditOutlined } from '@mui/icons-material';

const ProjectStats = () => {

    return (
            <StyledTable>
                <thead className='blinking' >
                    <tr>
                        <th><input type="checkbox"></input> </th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                        <th>S.NO</th>
                    </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{cursor:"pointer"}}>
                     <EditOutlined/>
                    </td>
                    <td>2</td>
                    <td>22/22/22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                    <td>22</td>
                  </tr>
                   </tbody>
            </StyledTable>
    )
}

export default ProjectStats
