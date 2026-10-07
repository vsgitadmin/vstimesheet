const roleConfig = [
    {
        path: "/auth/login",
        permissions: []
    },
    {
        path: "/auth/logout",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/auth/logout/check",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/update/password",
        permissions: []
    },
    //====================================================================    Employee Section   ================================================================================
    {
        path: '/employee/get',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/delete',
        permissions: ['SA', 'HR']
    },
    {
        path: '/employee/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/create',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/generate/timer/token',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/get/work/status',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/profile',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/profile/picture',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/update/public',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/activation/employee/id',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/get/totalcount',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/get/activation',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/todo/all',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/todo/create',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/todo/delete',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/todo/edit',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/todo/filter',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/uid/verify',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/todo/count',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/hr/dashboard',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/activities/all',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/get/employees/basic',
        permissions: ['EMP']
    },
    {
        path: "/employee/activities/latest",
        permissions: ["EMP", "SA", "HR", "PA", "STL"]
    },
    {
        path: '/employee/activities/create',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/activities/get',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/dashboard',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/details',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/filterd',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/update',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/get/uid',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/update/punch',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/employee/get/punch',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB']
    },
    //===================================================================   Job Section   =========================================================================================
    {
        path: "/jobs/create",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/all",
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/pending/all",
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/details",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/jobs/activity',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/jobs/submission/create',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/jobs/submission/delete',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/jobs/submission/get',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/update",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/delete",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/award/job",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/dashboard",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/sales/perfomance",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/get/awarded/all",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/awarded/update",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/get/dashboard/all",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/jobs/dashboard/update',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/jobs/dashboard/report/generate',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/jobs/submission/report/generate',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/get/totalcount",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/awarded/totalcount",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/filterd",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/rebar/get",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/rebar/update",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/rebar/list",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/rebar/all",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/awarded/filterd",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/dashboard/filterd",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/get/analytics",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/get/orders",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/create/orders",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/update/orders",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/jobs/delete/orders",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/create/co/report",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/dashboard/get/analytics",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    //=====================================================================    Management Section   ================================================================================== 

    {
        path: "/management/create/activation/request",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/management/get/activation/requests",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/management/approve/account/activation/request',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/management/get/activation/single',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/management/get/activation/single',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/management/activation/get/totalcount',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/management/activation/filterd',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/management/send/activation/review',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    //=====================================================================    Rebar Jobs =============================================
    {
        path: "/rebar/create",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/all",
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/pending/all",
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/details",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/rebar/activity',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/update",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/delete",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/award/job",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/dashboard",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/sales/perfomance",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/get/awarded/all",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/awarded/update",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/get/dashboard/all",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: '/rebar/dashboard/update',
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/get/totalcount",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/awarded/totalcount",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/filterd",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/rebar/get",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/rebar/update",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/get/orders",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/create/orders",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/update/orders",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/delete/orders",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/rebar/list",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/rebar/all",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/awarded/filterd",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/dashboard/filterd",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/rebar/get/analytics",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    {
        path: "/dashboard/get/analytics",
        permissions: ['EMP', 'SA', 'HR', 'PA', 'RB', 'STL']
    },
    //=====================================================================   TimeSheet Section   ====================================================================================

    {
        path: '/timesheet/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/details',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/aggregate',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/attendence/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/attendence/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/attendence/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/attendence/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/reject',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/filter/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/count',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/hr/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/forward',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/approve/leave',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/cancel',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/activities',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/activities/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/activities/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/activities/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/validate',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/timesheet/leave/get/forwarded',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    //=====================================================================   Constants Section   ====================================================================================

    {
        path: '/billing/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/billing/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/billing/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/billing/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/billing/get/list',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    //=====================================================================   Billing Route   ====================================================================================
    {
        path: '/constants/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/constants/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/constants/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/constants/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/constants/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    {
        path: 'files/activation/documents',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/files/generate/activation',
        permissions: ['HR']
    },
    {
        path: '/files/delete/files',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    //=====================================================================   Projects Section   ====================================================================================

    {
        path: '/projects/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/all/raw',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/summary',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/edit',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/single',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/get/members',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/remove/members',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/edit',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
        {
        path: '/projects/task/refresh/hrs',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/assign',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/add/members',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/get/employees',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/get/tasks',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/get/tasks/count',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/get/tasks/section/count',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/activity/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/activity/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/activity/edit',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/search',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/employee/performance',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/activity/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/dashboard',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/dashboard/list/analytics',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/filter/tasks',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/activity/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/activity/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/activity/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/activity/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/general',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/complete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/task/assigned',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/cloud/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/cloud/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/cloud/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/all/count',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/cloud/get/analytics',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/cloud/pin',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/cloud/get/pinned',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/cloud/search',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/toogle/employeerole',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/admin/dashboard',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/admin/projects',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/generate/project/report',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/drawing/new',
        permissions: ['SA', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/drawing/update',
        permissions: ['SA', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/drawing/remove',
        permissions: ['SA', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/drawing/get',
        permissions: ['SA', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/projects/get/stats',
        permissions: ['PA']
    },
    // ============================================================= Reports Section =============================================================

    {
        path: '/reports/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/generate',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/csv/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/get/file',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/refresh',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/csv/generate',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/keys',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/reports/get/totalcount',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    // ============================================================= Reports Section =============================================================

    {
        path: '/notice/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/notice/get/emp',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/notice/get/hr',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/notice/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/notice/get/emp/totalcount',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/notice/get/hr/totalcount',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    // ============================================================= Communication Section =============================================================

    {
        path: '/communication/notification/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/communication/notification/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/communication/notification/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/communication/email/send',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    // ============================================================= Communication Section =============================================================

    {
        path: '/cloud/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/get/count',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/search',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/forward',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/get/public',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/bulk/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/bulk/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/cloud/bulk/update/file',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    // ============================================================= Cloud Settings =============================================================
    {
        path: '/filters/employee',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    {
        path: '/filters/jobs',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    {
        path: '/filters/jobs/awarded',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    {
        path: '/filters/jobs/projects',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/filters/select/employee',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    }, {
        path: '/filters/select/project',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    // ============================================================= Messaging Settings =============================================================

    {
        path: '/messaging/chatlist/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chatlist/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chatlist/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chatlist/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chatlist/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chat/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chat/fetch',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/group/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/group/joined/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/group/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/group/join',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/group/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/group/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/group/add/member',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chatfiles/document/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chatfiles/document/public',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chatfiles/document/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/messaging/chatfiles/document/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    // ============================================================= Review Settings =============================================================

    {
        path: '/review/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/employee/analytics/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/employee/analytics/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/employee/get/analytics',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/employee/analytics/single',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/employee/analytics/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/request/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/request/get/active',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/request/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/request/delete',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/request/get/all',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/employee/analytics/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/employee/analytics/generate',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/request/reviewer/get',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/review/request/get/single',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },

    // ================= Training Section ======================== //

    {
        path: "/trainings/create",
        permissions: ["SA", "HR", "PA", "STL"],
    },
    {
        path: "/trainings/get",
        permissions: ["SA", "HR", "EMP", "PA", "STL"],
    },
    {
        path: "/trainings/all",
        permissions: ["SA", "HR", "EMP", "PA", "STL"],
    },
    {
        path: "/trainings/assigned",
        permissions: ["SA", "HR", "EMP", "PA", "STL"],
    },
    {
        path: "/trainings/assigned/completed",
        permissions: ["SA", "HR", "EMP", "PA", "STL"],
    },
    {
        path: "/trainings/assigned/incomplete",
        permissions: ["SA", "HR", "EMP", "PA", "STL"],
    },
    {
        path: "/trainings/created",
        permissions: ["SA", "HR", "PA", "STL"],
    },
    {
        path: "/trainings/completed",
        permissions: ["SA", "HR", "EMP", "PA", "STL"],
    },
    {
        path: "/trainings/incomplete",
        permissions: ["SA", "HR", "EMP", "PA", "STL"],
    },
    {
        path: "/trainings/complete",
        permissions: ["SA", "HR", "EMP", "PA", "STL"],
    },
    {
        path: "/trainings/edit",
        permissions: ["SA", "HR", "PA", "STL"],
    },
    {
        path: "/trainings/delete",
        permissions: ["SA", "HR", "PA", "STL"],
    },
    {
        path: "/trainings/change-status",
        permissions: ["SA", "HR", "PA", "EMP", "STL"],
    },
    {
        path: "/trainings/dashboard",
        permissions: ["SA", "HR", "PA", "EMP", "STL"],
    },
    {
        path: "/trainings/search",
        permissions: ["SA", "HR", "PA", "EMP", "STL"],
    },
    {
        path: "/trainings/get/count",
        permissions: ["SA", "HR", "PA", "EMP", "STL"],
    },
    // ================= Config Section ======================== //
    {
        path: "/config/get",
        permissions: ["SA", "HR", "PA", "EMP", "STL", "RB"],
    },
    {
        path: "/config/update",
        permissions: ["SA", "HR", "PA", "EMP", "STL"],
    },
    {
        path: "/config/create",
        permissions: ["SA", "HR", "PA", "EMP", "STL", "RB"],
    },
    {
        path: "/config/delete",
        permissions: ["SA", "HR", "PA", "EMP", "STL"],
    },
    // ================= Punching Info Section ======================== //
    {
        path: '/punching-info/create',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/punching-info/list',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/punching-info/update',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    {
        path: '/punching-info',
        permissions: ['SA', 'HR', 'EMP', 'PA', 'RB', 'STL']
    },
    // ================= Backup & Restore Section ======================== //
    // Full-database backup/restore is destructive and exposes every record,
    // so it stays Super Admin only even if role checks get re-enabled.
    {
        path: '/backup/create',
        permissions: ['SA']
    },
    {
        path: '/backup/list',
        permissions: ['SA']
    },
    {
        path: '/backup/restore',
        permissions: ['SA']
    },
    {
        path: '/backup/progress',
        permissions: ['SA']
    },
    {
        path: '/backup/download',
        permissions: ['SA']
    },
    {
        path: '/backup/upload',
        permissions: ['SA']
    },
    {
        path: '/backup/delete',
        permissions: ['SA']
    }
]

module.exports = roleConfig
