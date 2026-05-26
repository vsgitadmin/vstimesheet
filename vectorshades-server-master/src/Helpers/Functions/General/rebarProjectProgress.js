function calculateRebarProjectProgress(data) {
    let sumEstimatedTons = 0;
    let sumTonsDetailed = 0;
  
    data.forEach(item => {
      if (item.total_breakpoints && item.total_breakpoints.estimatedTons !== undefined) {
        sumEstimatedTons += item.total_breakpoints.estimatedTons;
      }
  
      if (item.total_breakpoints && item.total_breakpoints.tonsDetailed !== undefined) {
        sumTonsDetailed += item.total_breakpoints.tonsDetailed;
      }
    });
  
    // Avoid division by zero
    if (sumEstimatedTons === 0) {
      return 0;
    }
  
    const progressPercent = (sumTonsDetailed / sumEstimatedTons) * 100;
    return progressPercent;
  }

module.exports = calculateRebarProjectProgress