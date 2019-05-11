const timeFormater = (time, format, negative) => {
  const start = format ? 14 : 11
  const length = format ? 5 : 8
  const timeObj = new Date(null);
  timeObj.setSeconds(time); // specify value for SECONDS here
  let leftFormat
  if (negative == true) {
    leftFormat = '- '
  } else if (negative == false) {
    leftFormat = '  '
  } else {
    leftFormat = ''
  }
  return leftFormat + timeObj.toISOString().substr(start, length)
}

export default timeFormater