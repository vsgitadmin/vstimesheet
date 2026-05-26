function Initiate(crons) {
    crons.forEach((cron) => cron.start())
}

module.exports = Initiate