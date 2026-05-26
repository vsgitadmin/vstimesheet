const {
    configRoute,
    employeeRoute,
    cloudRoute,
    filterRoute,
    noticeRoute,
    managementRoute,
    reportsRoute,
    projectRoute,
    authenticationRoute,
    jobsroute,
    timesheetRoute,
    constantRoute,
    fileRoutes,
    communicationRoute,
    publicRoute,
    messagingRoute,
    reviewRoute,
    trainingRouter,
    rebarJobsRoute,
    billingRoute
} = require("../Extractor/Extractor")

let routes = []

const PushRoute = (url, func) => routes.push({"url": url, "routerObj": func})

PushRoute("/employee", employeeRoute)
PushRoute("/management", managementRoute)
PushRoute("/auth", authenticationRoute)
PushRoute("/jobs", jobsroute)
PushRoute("/rebar", rebarJobsRoute)
PushRoute('/timesheet', timesheetRoute)
PushRoute('/constants', constantRoute)
PushRoute('/files', fileRoutes)
PushRoute('/projects', projectRoute)
PushRoute('/reports', reportsRoute)
PushRoute('/communication', communicationRoute)
PushRoute('/filters', filterRoute)
PushRoute('/cloud', cloudRoute)
PushRoute('/notice', noticeRoute)
PushRoute('/messaging', messagingRoute)
PushRoute('/review', reviewRoute)
PushRoute("/trainings", trainingRouter);
PushRoute("/billing", billingRoute);
PushRoute('/config', configRoute)

// Public test endpoints
PushRoute('/public', publicRoute)

module.exports = routes