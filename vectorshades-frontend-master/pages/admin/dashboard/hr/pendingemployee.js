import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getAllActivationReq } from '../../../../src/Controllers/Hr/index'
import Table from '../../../../src/Components/Hr/tablependingemployee';

function PendingEmployee() {

    const [Actrequest, SetActrequest] = useState([]);

    useEffect(() => {
        getAllActivationReq()
        .then((result) =>{SetActrequest(result.data.response.requests)})
        .catch((error) => {console.log(error.message) })
    }, []);
    
    
    return (
        <>
    <section className='page_content'>
    <div className="row fx_hv_between_center">
        <h1 className='h4_title'>Pending Employee List</h1>
        <Link className='btn' href={'/admin/dashboard/hr/add'}>Create Employee</Link>
      </div>
      <Table props={Actrequest} />
  
    </section>
    
    </>
    )
}

export default PendingEmployee;