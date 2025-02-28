const getFormatDate = (timestamp) => {
  if (!timestamp)
    return timestamp;

  const date = new Date(timestamp);
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date)

  return formattedDate.replace(/(\d{1,2})\.\s([오전|오후])/, '$1 $2');
}

const formatUnixTimeUTC = (unixTime) => {
  if (!unixTime) return "00:00";

  const date = new Date(unixTime * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};


export { getFormatDate, formatUnixTimeUTC };