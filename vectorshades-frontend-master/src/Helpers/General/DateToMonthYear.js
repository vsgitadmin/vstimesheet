const DateToMonthYear = (date) => new Date(date).toString().split(" ").slice(1, 3).join(" ")

module.exports = DateToMonthYear