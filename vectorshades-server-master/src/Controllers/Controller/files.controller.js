var fs = require('fs');
const path = require('path');
const { employee: { employeeModel } } = require('../../Models/Extractor/index');
const { employee: { processEmployeeActivationRequest } } = require("../../Helpers/Extractor/index")
const axios = require('axios');
const { fillOnboardingBody } = require('../../Helpers/Functions/General/data');
const { FILE_SERVER } = require('../../../config');
const { s3KeyFromLocationOrKey } = require('../../Helpers/Functions/S3/index');

/**
 * Normalize profile photo for the file server. The Python service downloads from S3
 * directly, so pass the object key (not a presigned URL that can expire before embed).
 */
function resolvePhotoPathForGeneration(photoPath) {
    if (!photoPath || typeof photoPath !== 'string') return '';
    const trimmed = photoPath.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) {
        try {
            return s3KeyFromLocationOrKey(trimmed);
        } catch (err) {
            console.warn('extract S3 key from photo URL failed:', err.message);
            return trimmed;
        }
    }

    const fileName = trimmed.split('/').filter(Boolean).pop();
    const localPath = path.join(__dirname, '../../../public/profile', fileName);
    if (fileName && fs.existsSync(localPath)) {
        const port = process.env.PORT || 8000;
        return `http://127.0.0.1:${port}/public/profile/${fileName}`;
    }

    return trimmed.replace(/^\/+/, '');
}

const documentUploadActivationController = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.file;
    var dir = `./public/${req.query.type}`;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Use the mv() method to place the file somewhere on your server

    file.mv(`./public/${req.query.type}/${req.query.rename ? req.query.rename : file.name}`, function (err) {
        if (err)
            return res.status(500).send(err);
    });


    if (req.query.type === '/profile') {
        const emp = await employeeModel.findOne({ _id: req.query.user })
        emp.icon = true;
        await emp.save()
    }


    // if(req.query.rename){
    //     let finalPath = __dirname.split('src').slice(0,1)
    //     finalPath.push(`public/profile/${file.name}`)
    //     finalPath = finalPath.join('')
    //     let renamedPath = finalPath.replace(file.name,`${req.query.rename}`)
    //     fs.rename(finalPath,renamedPath,function(err) {
    //         if ( err ) console.log('ERROR: ' + err);
    //     })
    // }

    res.json({ success: true, message: "file uplaoded", name: file.name })
}

const getFile = async (req, res, next) => {
    const filePath = path.join(__dirname, '../../../', req.query.path);
    const options = {
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true,
        }
    }
    try {
        res.download(filePath, 'hello', options);
        console.log("File sent successfully!");
    }
    catch (error) {
        console.error("File could not be sent!");
        next(error);
    }
}

const deleteFileController = async (req, res) => {
    try {
        const path = `./public${req.query.type}${req.query.path}`
        fs.unlink(path, function (err) {
            if (err) {
                console.error(err);
                return;
            }
            return res.json({ success: true, message: "file deleted" })
        });
    } catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, message: "file delete failed" })
    }
}

const getEmployeeActivatedDocumentController = async (req, res) => {
    try {
        const details = await employeeModel.findOne({ _id: req.query.id }).lean()
        if (!details) {
            return res.status(400).json("Employee not yet Activated")
        }

        const processedData = processEmployeeActivationRequest(details.publicDetails)
        const data = fillOnboardingBody(processedData)
        if (data.photo_path) {
            data.photo_path = resolvePhotoPathForGeneration(data.photo_path)
        }

        const fileServer = (FILE_SERVER || 'http://127.0.0.1:50000/').replace(/\/+$/, '')
        const response = await axios.post(
            `${fileServer}/files/generate/activation`,
            { id: req.query.id, data, name: details.firstName },
        )

        const docPath = response.data?.path
        if (!docPath) {
            console.error('activation doc generation missing path:', response.data)
            return res.status(500).json({
                success: false,
                message: 'error occured',
                error: response.data?.error,
            })
        }

        res.json({ path: docPath, success: true })
    } catch (err) {
        console.error('activation doc generation failed:', err.response?.data || err.message)
        res.status(500).json({ success: false, message: 'error occured' })
    }
}



module.exports = { documentUploadActivationController, getFile, getEmployeeActivatedDocumentController, deleteFileController }