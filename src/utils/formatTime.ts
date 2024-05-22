const TIME_SECOND = 1000;
const TIME_MINUTE = TIME_SECOND * 60;
const TIME_HOUR = TIME_MINUTE * 60;
const TIME_DAY = TIME_HOUR * 24;

export function getTodayUTC() {
  const nowUtc = new Date();

  const tomorrowUtc = new Date(nowUtc);
  tomorrowUtc.setUTCDate(nowUtc.getUTCDate() + 1);
  tomorrowUtc.setUTCHours(0, 0, 0, 0);

  return tomorrowUtc.getTime();
}

function calcCountdown(timestamp: number, range: number) {
  const lave = timestamp % range;
  const value = timestamp - lave;

  return [value / range, lave];
}

export function getCountdown(timestamp: number) {
  var d, h, m, s;
  [d, timestamp] = calcCountdown(timestamp, TIME_DAY);
  [h, timestamp] = calcCountdown(timestamp, TIME_HOUR);
  [m, timestamp] = calcCountdown(timestamp, TIME_MINUTE);
  [s, timestamp] = calcCountdown(timestamp, TIME_SECOND);

  return [d, h, m, s];
}

export function formatTime(timestamp?: number) {
  if (!timestamp) return "-";

  return new Date(timestamp)
    .toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: "UTC",
    })
    .replaceAll("/", "-");
}

export function formatTimeRange(startTimestamp?: number, endTimestamp?: number) {
  if (!startTimestamp || !endTimestamp) return "-";

  const startTime = formatTime(startTimestamp);
  const endTime = formatTime(endTimestamp);

  return `${startTime} - ${endTime}`;
}
