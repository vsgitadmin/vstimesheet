import React from 'react'

function JobActivity({direct,total,added,removed,updated}) {
  return (
    <div className="job_activity">
        {direct && 
            <div className='direct_changes'>
                <h4>Direct Changes</h4>
                <ul>
                    {Object.keys(direct).map((key) => <li>{key} : {direct[key]}</li>)}
                </ul>
            </div>
        }
        {total && 
            <div className='direct_changes'>
                <h4>Main Total Changes</h4>
                <ul>
                    {Object.keys(total).map((key) => <li>{key} : {total[key]}</li>)}
                </ul>
            </div>
        }
        {added || removed || updated && <h2>Point Logs</h2>}
        {added && 
            <div className='direct_changes'>
                <h4>Added Points</h4>
                <ul>
                    {added.map((value) => <li>{value}</li>)}
                </ul>
            </div>
        }
        {removed && 
            <div className='direct_changes'>
                <h4>Removed Points</h4>
                <ul>       
                    {removed.map((value) => <li>{value}</li>)}
                </ul>
            </div>
        }
        {updated && 
            <div className='direct_changes'>
                <h4>Updated points</h4>
                <ul>
                    {updated.map((object) => {
                        object['point'] = object.name
                        return(
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            {Object.keys(object).map((key) => <td>{key}</td>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {Object.keys(object).map((key) => {
                                                let splited = object[key].split(' ')
                                                return <td>{splited[0]}</td>
                                            })}
                                        </tr>
                                        <tr>
                                            {Object.keys(object).map((key) => {
                                                let splited = object[key].split(' ')
                                                return <td>{splited.at(-1)}</td>
                                            })}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )
                    })}
                </ul>
            </div>
        }
    </div>
  )
}

export default JobActivity