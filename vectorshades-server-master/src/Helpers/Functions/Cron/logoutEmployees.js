
async function logoutEmployees(employees, { concurrency = 10 } = {}) {
    const { logoutUser } = require("../../../Controllers/ControllerFunction/Authentication");
    if (!Array.isArray(employees)) throw new TypeError("employees must be an array");

    const toLogout = employees.filter(
        (emp) => emp && (emp._id ?? emp.id) && (emp.logedIn || emp.loggedIn || emp.isOnline)
    );

    const summary = {
        requested: employees.length,
        attempted: toLogout.length,
        succeeded: 0,
        failed: 0,
        errors: [],
    };

    for (let i = 0; i < toLogout.length; i += concurrency) {
        const chunk = toLogout.slice(i, i + concurrency);

        const promises = chunk.map((emp) =>
            (async () => {
                const id = emp._id ?? emp.id;
                try {
                    await logoutUser({ id, role: emp.role });
                } catch (logoutErr) {
                    return { id, ok: false, phase: "logout", error: logoutErr };
                }

                try {
                    if (typeof emp === "object") {
                        emp.logedIn = false;
                        emp.loggedIn = false;
                        emp.isOnline = false;
                        emp.loginTime = 0;
                        emp.todayLoged = 0;
                        emp.taskTime = 0;
                    }

                    if (typeof emp.save === "function") {
                        await emp.save();
                    }

                    return { id, ok: true };
                } catch (saveErr) {
                    return { id, ok: false, phase: "save", error: saveErr };
                }
            })()
        );

        const results = await Promise.allSettled(promises);
        for (const r of results) {
            if (r.status === "fulfilled") {
                const val = r.value;
                if (val && val.ok) summary.succeeded++;
                else {
                    summary.failed++;
                    summary.errors.push(val);
                }
            } else {
                summary.failed++;
                summary.errors.push({ ok: false, phase: "promise_rejected", error: r.reason });
            }
        }
    }

    return summary;
}

module.exports = logoutEmployees;
