function timeFormatter(time: number, format?: boolean, negative?: boolean): string {
  let s = Math.floor(time), m = 0, h = 0
  if (s >= 60) {
    m = Math.floor(time / 60)
    s = Math.floor(time % 60)
    if (m >= 60) {
      h = Math.floor(m / 60)
      m = Math.floor(m % 60)
    }
  }
  let timeStrig = `${h > 0 || format === false ? (h < 10 ? '0' + h : h) + ":" : ""}${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
  let leftFormat = negative === true ? '- ' : negative === false ? '  ' : ''
  return leftFormat + timeStrig
}

export default timeFormatter