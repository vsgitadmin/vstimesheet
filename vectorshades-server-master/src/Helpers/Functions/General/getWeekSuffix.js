const getWeekSuffix = (weekNumber) => {
    if (weekNumber === 1) {
      return 'st';
    } else if (weekNumber === 2) {
      return 'nd';
    } else if (weekNumber === 3) {
      return 'rd';
    } else {
      return 'th';
    }
  };

  module.exports = {getWeekSuffix}