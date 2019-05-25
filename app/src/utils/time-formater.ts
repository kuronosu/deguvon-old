function timeFormater(time: number, format: boolean, negative?: boolean): string {
  const timeObj = new Date()
  timeObj.setSeconds(time) // specify value for SECONDS here
  let leftFormat: string
  if (negative === true) {
    leftFormat = '- '
  } else if (negative === false) {
    leftFormat = '  '
  } else {
    leftFormat = ''
  }
  return leftFormat + timeObj.toISOString().substr(format ? 14 : 11, format ? 5 : 8)
}

export default timeFormater