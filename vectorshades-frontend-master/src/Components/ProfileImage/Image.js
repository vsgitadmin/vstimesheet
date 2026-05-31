import { Avatar } from "@mui/material"
import { useEffect, useState } from "react"
import { presignGetUrl } from "../../Controllers/files/index"
import { profilePictureKeysToTry } from "../../Helpers/Constants/profilePicture"

const FALLBACK_URL =
  "https://qph.cf2.quoracdn.net/main-qimg-6d72b77c81c9841bd98fc806d702e859-lq"

const ProfileImage = ({ size, id, style, onClick, imageKey, version = 0 }) => {
  const [validUrl, setValidUrl] = useState(null)

  useEffect(() => {
    if (!id) return undefined
    let cancelled = false
    const keys = profilePictureKeysToTry(id, imageKey)

    const load = async () => {
      for (const key of keys) {
        try {
          const u = await presignGetUrl(key)
          if (!cancelled && u) {
            setValidUrl(u)
            return
          }
        } catch {
          // try next key
        }
      }
      if (!cancelled) setValidUrl(FALLBACK_URL)
    }

    setValidUrl(null)
    load()

    return () => {
      cancelled = true
    }
  }, [id, imageKey, version])

  const handleError = () => {
    setValidUrl(FALLBACK_URL)
  }

  return (
    <Avatar
      onClick={onClick}
      style={{ width: size, height: size, ...style }}
      src={validUrl || undefined}
      imgProps={{ onError: handleError }}
    />
  )
}

export default ProfileImage
