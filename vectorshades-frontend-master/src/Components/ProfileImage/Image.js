import { Avatar } from "@mui/material"
import { useEffect, useState } from "react"
import { presignGetUrl } from "../../Controllers/files/index"

const ProfileImage = ({ size, id, style, onClick }) => {
  const [validUrl, setValidUrl] = useState(null)
  const fallbackUrl = `https://qph.cf2.quoracdn.net/main-qimg-6d72b77c81c9841bd98fc806d702e859-lq`

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const key = `profile/${id}.jpeg`
    presignGetUrl(key)
      .then((u) => {
        if (!cancelled) setValidUrl(u)
      })
      .catch(() => {
        if (!cancelled) setValidUrl(fallbackUrl)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleError = () => {
    setValidUrl(fallbackUrl)
  }

  return (
    <Avatar onClick={onClick} style={{ width: size, height: size, ...style }} src={validUrl || undefined} imgProps={{ onError: handleError }} />
  )
}

export default ProfileImage
