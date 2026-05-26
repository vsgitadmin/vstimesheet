import Main from "../../../../src/Components/Chat/Main"
import { ParentStore } from '../../../_app';

const index = () => {
  return (
    <>
      <Main ParentStore={ParentStore} />
    </>
  )
}

export default index