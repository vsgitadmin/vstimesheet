import React from 'react'
import {StyledTable,Flexspan,Blockspan,Avatar,Container}  from './Table.Styled'
import Image from 'next/image'
import MoreVertIcon from '@mui/icons-material/MoreVert';

function Table() {
    return (
      <Container>
          <StyledTable>
            <thead>
                <tr>
                <th>
                        <input type="checkbox"></input>
                    </th>
                    <th>
                        Name
                    </th>
                    <th>
                        Card
                    </th>
                    <th>
                        Assigned to
                    </th>
                    <th>
                        Last Transaction
                    </th>
                    <th>
                        Status
                    </th>
                    
                    <th>
                        End Date
                    </th>
                    <th>
                        Total Used
                    </th>
<th>

</th>
                </tr>

            </thead>
            <tbody>
                <tr>
                    <td><input type="checkbox"></input> </td>
                    <td>
                        <Flexspan className="row-flex">
                            <span className="table-img-wrapper">
                                <Avatar src="/Images/fire.png" alt="Avatar" />
                            </span>
                            <Blockspan>
                            <Blockspan className='tb-title'>Figma</Blockspan>
                            <Blockspan className='tb-sm-content'>https://www.figma.com</Blockspan>
                            </Blockspan>
                        </Flexspan>
                    </td>

                    <td>
                         <Blockspan>
                            <Blockspan className='tb-title'>Visa</Blockspan>
                            <Blockspan className='tb-sm-content'>******2648</Blockspan>
                            </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-title'>Itai Bracha</Blockspan>
                            <Blockspan className='tb-sm-content'>Itai Bracha31@gmail.com</Blockspan>
                        </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-title'>Jan 2,2022</Blockspan>
                            <Blockspan className='tb-sm-content'>$783.22</Blockspan>
                        </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-title' Fontcolor={("done"=="done"?"#17E383":"#FF9548") } Borderbefore>Done</Blockspan>
                         </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-title'>Jan 12,2022</Blockspan>
                        </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-md-title'>$783.22</Blockspan>
                        </Blockspan> 
                    </td>
                    <td>
                        <MoreVertIcon  fontSize='14'/>
                    </td>
                </tr>
                <tr>
                    <td><input type="checkbox"></input> </td>
                    <td>
                        <Flexspan className="row-flex">
                            <span className="table-img-wrapper">
                                <Avatar src="/Images/fire.png" alt="Avatar" />
                            </span>
                            <Blockspan>
                            <Blockspan className='tb-title'>Figma</Blockspan>
                            <Blockspan className='tb-sm-content'>https://www.figma.com</Blockspan>
                            </Blockspan>
                        </Flexspan>
                    </td>

                    <td>
                         <Blockspan>
                            <Blockspan className='tb-title'>Visa</Blockspan>
                            <Blockspan className='tb-sm-content'>******2648</Blockspan>
                            </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-title'>Itai Bracha</Blockspan>
                            <Blockspan className='tb-sm-content'>Itai Bracha31@gmail.com</Blockspan>
                        </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-title'>Jan 2,2022</Blockspan>
                            <Blockspan className='tb-sm-content'>$783.22</Blockspan>
                        </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-title' Fontcolor={("done"=="done"?"#17E383":"#FF9548") } Borderbefore>Done</Blockspan>
                         </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-title'>Jan 12,2022</Blockspan>
                        </Blockspan> 
                    </td>
                    <td>
                        <Blockspan>
                            <Blockspan className='tb-md-title'>$783.22</Blockspan>
                        </Blockspan> 
                    </td>
                    <td>
                        <MoreVertIcon fontSize='14'/>
                    </td>
                </tr>
            </tbody>
            </StyledTable>
            </Container>    
    )
  }
  
  export default Table
  