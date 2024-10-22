import moment from "moment";

export function formatDuration(duration: moment.MomentInput) {
  return moment.utc(duration).format("HH:mm:ss");
}

export function formatTime(time: Maybe<string | Date>, format = "YYYY-MM-DD HH:mm:ss", defaultValue = "") {
  if (!time || (time instanceof Date && isNaN(time.getTime()))) {
    return defaultValue;
  }
  return moment(time).format(format);
}
