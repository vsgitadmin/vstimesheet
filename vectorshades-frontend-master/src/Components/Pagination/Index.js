import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';

function Paging({ onPageChange, noOfPages }) {

  const paginationStyle = {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    width: '80%',
    bottom: '30px'
  }
  
  return (
    <Pagination count={noOfPages} className='pagination-center' onChange={onPageChange} style={paginationStyle} />

  )
}

export default Paging;