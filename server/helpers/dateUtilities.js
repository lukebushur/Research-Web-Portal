// Create and return a new Date object that is the given number of minutes in
// the future from the given date.
function addMinutes(date, minutes) {
    return new Date(date.getTime() + (minutes * 60 * 1000));
}

// Create and return a new Date object that is the given number of seconds in
// the past from the given date.
function subtractSeconds(date, seconds) {
    return new Date(date.getTime() - (seconds * 1000));
}

export { addMinutes, subtractSeconds };