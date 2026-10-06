import { backup } from "../../Constants/API/Endpoints";
import instance from "../../Axios/Axios.config";

const createBackupController = () => {
    return instance.post(backup.create, {})
}

const listBackupsController = (page = 1, limit = 15) => {
    return instance.get(backup.list, { params: { page, limit } })
}

const restoreBackupController = (id) => {
    return instance.post(backup.restore, { id, confirm: true })
}

const getBackupProgressController = (jobId) => {
    return instance.get(backup.progress, { params: { jobId } })
}

const downloadBackupController = (id) => {
    return instance.get(backup.download, { params: { id }, responseType: 'blob' })
}

const uploadBackupController = (file, onUploadProgress) => {
    const formData = new FormData()
    formData.append('file', file)
    return instance.post(backup.upload, formData, { onUploadProgress })
}

const deleteBackupController = (id) => {
    return instance.delete(backup.delete, { params: { id } })
}

export {
    createBackupController,
    listBackupsController,
    restoreBackupController,
    getBackupProgressController,
    downloadBackupController,
    uploadBackupController,
    deleteBackupController,
}
