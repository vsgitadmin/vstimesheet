module.exports = {
    timeTohhmm: (time) => {
        let time_string = new Date(time).toLocaleTimeString().split(' ')
        return `${time_string[0].split(':')[0]}:${time_string[0].split(':')[1]} ${time_string[1]}`
    },

    formatTime: (timestamp) => {
        if (timestamp===null)
                return `00:00`
        const totalMinutes = Math.floor(timestamp / (60 * 1000)); // Convert to total minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}`;
    }
}