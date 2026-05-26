const getBusinessDays = () => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    let count = 0;
    for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(today.getFullYear(), today.getMonth(), i);
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
    }
    return count
}

module.exports = getBusinessDays