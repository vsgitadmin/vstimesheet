import React from 'react'

function HeadMapperRebar({ type }) {
    const columnValues = {
        'Detailing': ['','Scope', 'Estimated Hours', 'Estimated Tons', 'Ton P/H', 'Per Ton', '$Cost P/H', 'Cost', 'Bid Price', 'Price P/H', 'Bid %', 'Complexity'],
        'Estimation': ['','Scope', 'Estimated Hours', 'Estimated Tons', 'Ton P/H', 'Per Ton', '$Cost P/H', 'Cost', 'Bid Price', 'Price P/H', 'Bid %', 'Complexity'],
        'Dimensional Drawing': ['','Scope', 'Estimated Hours', 'Estimated Tons', 'Ton P/H', 'Per Ton', '$Cost P/H', 'Cost', 'Bid Price', 'Price P/H', 'Bid %', 'Complexity']
    }

    return columnValues[type].map((column) => <th>{column}</th>)
}

export default HeadMapperRebar