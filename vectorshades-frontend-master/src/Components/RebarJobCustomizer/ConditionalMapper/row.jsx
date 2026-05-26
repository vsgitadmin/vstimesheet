import React from 'react'

function RowMapperRebar({columnList}) {
  return columnList.map((column) => <th>{column}</th>)
}

export default RowMapperRebar