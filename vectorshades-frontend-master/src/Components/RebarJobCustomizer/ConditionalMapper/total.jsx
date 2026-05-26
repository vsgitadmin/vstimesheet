import React from 'react'

function TotalMapper({ parentTotal, type }) {
    const rebarKeys = {
        'Detailing': ['estimatedHours', 'estimatedTons', 'tonPH', 'perTon', 'costPH', 'cost', 'bidPrice', 'pricePH', 'bidPercentage'],
        'Estimation': ['estimatedHours', 'estimatedTons', 'tonPH', 'perTon', 'costPH', 'cost', 'bidPrice', 'pricePH', 'bidPercentage'],
        'Dimensional Drawing': ['estimatedHours', 'estimatedTons', 'tonPH', 'perTon', 'costPH', 'cost', 'bidPrice', 'pricePH', 'bidPercentage']
    }
    return (
        <tr className={'total_row'}>
            <th>
            </th>
            <th>Main Total</th>
            {rebarKeys[type].map((data) => <th>{parentTotal[data]}</th>)}
        </tr>
    )
}

export default TotalMapper