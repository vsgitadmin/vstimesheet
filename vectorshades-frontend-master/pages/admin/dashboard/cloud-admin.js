import { useState, useEffect } from "react"
import AddMemberPopup from "../../../src/Components/Popups/General/AddMemberPopup"
import { generateToken } from "../../../src/Helpers/General/JwtToken"
import { useRouter } from "next/router"
const index = () => {
  const router = useRouter()

  const handleUserSelected = (user) => {
    let token = generateToken(user)
    router.push({
      pathname: '/admin/dashboard/cloud',
      query: { token },
    });
  }

  return (
    <>
      <AddMemberPopup title="Select user" submit={handleUserSelected} subTitle="select employ to see user's cloud " />
    </>
  )
}

export default index