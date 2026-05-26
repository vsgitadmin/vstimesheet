import { useContext } from 'react'
import Activity from '../../../src/Components/Hr/Activity/Activity'
import { ParentStore } from "../../_app"
function activity() {

  const { ParentState } = useContext(ParentStore)

  return (
    <>
      <Activity ParentState={ParentState} />
    </>
  )
}

export default activity