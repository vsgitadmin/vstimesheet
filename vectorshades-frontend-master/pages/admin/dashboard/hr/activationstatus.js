import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getAllActivationReq } from '../../../../src/Controllers/Hr/index'


function ActivationStatus() {
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
        <h1 className='h4_title'>Activation Status List</h1>
        
      </div>
      <Table props={Actrequest} />
  
    </section>
    
    </>
    )
}

export default ActivationStatus;