import Bord from "../../../../src/Components/Bord/Bord"

const TODOItems =  [ {
  _id: "d1d8a138-cba7-4f5c-8f4b-c1407f4e28a6",
  employeeId: "0c59c8cb-aecd-415f-bccd-ada1b6133e33",
  title: "test",
  description: "test",
  priority: "Medium",
  status: "TD",
  createdAt: "2023-02-19T12:43:56.397Z",
  "__v": 0
}]

const Progress = []

const bord = () => {
  return (
    <>
    <Bord toDO={TODOItems} Progress={Progress} Completed={Progress} />
    </>
  )
}

export default bord