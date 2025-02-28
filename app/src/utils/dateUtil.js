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

const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export { getFormatDate, formatTime };