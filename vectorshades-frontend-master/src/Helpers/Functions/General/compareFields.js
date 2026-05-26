const activationReq = {
    _id: 'e48ca717-1d58-4677-8565-70576b1463cf',
    empId: '684cdcd6-9e83-460b-92a9-e04d18b3fd59',
    empName: 'Dan Paul',
    designation: 'developer',
    department: 'IT',
    updatedDetails: { adress: 'KOCHIN', phone: '121213' },
    approved: false,
    requestedDate: `2022-12-27T08:55:20.772Z`,
}

const requiredFields = ['adress', 'phone','id']

function compareFields(object, requiredFields) {
    requiredFields.map((key) => {
        if (object[key] == undefined || object[key] == null) {
        }
    })
}

const missingFields = compareFields(activationReq.updatedDetails, requiredFields)