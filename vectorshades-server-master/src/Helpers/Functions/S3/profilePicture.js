const { getS3, s3KeyFromLocationOrKey } = require('./index');

const BUCKET_NAME = process.env.BUCKET_NAME;

function employeeProfilePictureKey(employeeId) {
    if (employeeId == null || employeeId === '') return '';
    const id = String(employeeId).trim().replace(/^\/+/, '');
    return id ? `profile/${id}.jpeg` : '';
}

function normalizeProfilePictureKey(keyOrUrl, employeeId) {
    if (keyOrUrl == null || String(keyOrUrl).trim() === '') {
        return employeeProfilePictureKey(employeeId);
    }
    const trimmed = String(keyOrUrl).trim();
    if (/^https?:\/\//i.test(trimmed)) {
        try {
            return s3KeyFromLocationOrKey(trimmed) || employeeProfilePictureKey(employeeId);
        } catch {
            return employeeProfilePictureKey(employeeId);
        }
    }
    return trimmed.replace(/^\/+/, '').replace(/\/{2,}/g, '/');
}

async function copyProfileObject(sourceKey, targetKey) {
    const source = normalizeProfilePictureKey(sourceKey);
    const target = normalizeProfilePictureKey(targetKey);
    if (!source || !target || source === target) return target;

    const s3 = getS3();
    await s3
        .copyObject({
            Bucket: BUCKET_NAME,
            CopySource: `${BUCKET_NAME}/${source}`,
            Key: target,
        })
        .promise();
    return target;
}

async function setEmployeeProfileImageKey(employeeId, profileKey) {
    const key = normalizeProfilePictureKey(profileKey, employeeId);
    const { employee: { employeeModel } } = require('../../../Models/Extractor/index');
    const emp = await employeeModel.findById(employeeId);
    if (!emp) throw new Error('Employee not found');

    emp.icon = true;
    emp.profileImageKey = key;
    if (!emp.publicDetails || typeof emp.publicDetails !== 'object') emp.publicDetails = {};
    if (!emp.publicDetails.personal_details || typeof emp.publicDetails.personal_details !== 'object') {
        emp.publicDetails.personal_details = {};
    }
    emp.publicDetails.personal_details.img = key;
    emp.markModified('publicDetails');
    await emp.save();
    return { profileImageKey: key, icon: true };
}

async function syncProfilePictureToEmployeeKey(employeeId, sourceKeyOrUrl) {
    const targetKey = employeeProfilePictureKey(employeeId);
    const sourceKey = normalizeProfilePictureKey(sourceKeyOrUrl, employeeId);
    if (sourceKey && sourceKey !== targetKey) {
        try {
            await copyProfileObject(sourceKey, targetKey);
        } catch (err) {
            console.warn('profile copy failed, saving key only:', err.message);
        }
    }
    return setEmployeeProfileImageKey(employeeId, targetKey);
}

module.exports = {
    employeeProfilePictureKey,
    normalizeProfilePictureKey,
    syncProfilePictureToEmployeeKey,
    setEmployeeProfileImageKey,
};
