import instance from "../../Axios/Axios.config";
import { file } from "../../Constants/API/Endpoints";

const activationDocumentUpload = async (form, query) => {
  try {
    const response = await instance.post(file.activationDocument, form, { headers: { 'Content-Type': 'multipart/form-data' }, params: query })
    return response
  } catch (err) { throw err }
}

const downlaodFile = async (query) => {
  try {
    const response = await instance.get(file.download, { params: query })
    return response
  } catch (err) { throw err }
}

const generateActivationDocument = async (id) => {
  try {
    const response = await instance.post(file.generateActivationDocument, {}, { params: { id: id } })
    return response
  } catch (err) { throw err }
}

const DeleteDocument = async (query) => {
  try {
    const response = await instance.delete(file.deleteFiles, { params: query })
    return response
  } catch (err) { throw err }
}

async function presignUpload(key, contentType) {
  const res = await fetch("/api/s3/presign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, contentType }),
  });

  if (!res.ok) {
    throw new Error(`Failed to presign upload (${res.status})`);
  }

  return await res.json(); // { uploadUrl, location, key }
}

async function presignGetUrl(keyOrUrl, expiresIn) {
  const res = await fetch("/api/s3/presign-get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: keyOrUrl, expiresIn }),
  });

  if (!res.ok) {
    throw new Error(`Failed to presign download (${res.status})`);
  }

  const data = await res.json();
  return data.url;
}

async function uploadViaSignedPut(uploadUrl, file, onProgress) {
  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    if (file?.type) xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (e) => {
      if (onProgress) {
        onProgress({ loaded: e.loaded, total: e.total });
      }
    };

    xhr.onload = () => {
      // Successful PUT returns 200/204 depending on bucket settings.
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed (${xhr.status})`));
    };

    xhr.onerror = () => reject(new Error("Upload failed (network error)"));

    xhr.send(file);
  });
}

const uploadS3Document = async (file, fileName) => {
  const { uploadUrl, location } = await presignUpload(fileName, file?.type);
  await uploadViaSignedPut(uploadUrl, file);
  return { Location: location };
};

const uploadCloudS3Document = (file, fileName) => {
  let progressListener = null;

  const api = {
    on: (event, cb) => {
      if (event === "httpUploadProgress") progressListener = cb;
      return api;
    },
    promise: async () => {
      const { uploadUrl, location } = await presignUpload(fileName, file?.type);

      await uploadViaSignedPut(uploadUrl, file, (progress) => {
        if (progressListener) progressListener(progress);
      });

      return { Location: location };
    },
  };

  return api;
};

const deleteS3Document = async (fileKey) => {
  const res = await fetch("/api/s3/delete-object", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: fileKey }),
  });

  if (!res.ok) {
    throw new Error(`Failed to delete S3 object (${res.status})`);
  }

  return await res.json();
};

export { activationDocumentUpload, downlaodFile, generateActivationDocument, DeleteDocument, uploadS3Document, deleteS3Document, uploadCloudS3Document, presignGetUrl }
