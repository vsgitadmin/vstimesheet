function formatDate(dateString) {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${day}-${month}-${year}`;
}

export function formatTime(isoString) {
  const date = new Date(isoString);
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // hour '0' should be '12'
  const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${paddedMinutes} ${ampm}`;
}


export default formatDate