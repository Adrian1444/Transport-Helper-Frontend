function parseTimeStr(timeStr) {
    const timeUnits = {
        days: 0,
        hours: 0,
        mins: 0,
    };

    const regex = /(\d+)\s+(day|hour|min)/g;
    let match;

    while ((match = regex.exec(timeStr)) !== null) {
        const value = parseInt(match[1], 10);
        const unit = match[2] + 's'; // pluralize the unit
        timeUnits[unit] = value;
    }

    return timeUnits;
}

function addTimeStrings(timeStr1, timeStr2) {
    const time1 = parseTimeStr(timeStr1);
    const time2 = parseTimeStr(timeStr2);

    const totalMins = time1.mins + time2.mins;
    const totalHours = time1.hours + time2.hours + Math.floor(totalMins / 60);
    const totalDays = time1.days + time2.days + Math.floor(totalHours / 24);

    const mins = totalMins % 60;
    const hours = totalHours % 24;
    const days = totalDays;

    const result = [];
    if (days > 0) {
        result.push(`${days} ${days === 1 ? "day" : "days"}`);
    }
    if (hours > 0) {
        result.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
    }
    if (mins > 0) {
        result.push(`${mins} ${mins === 1 ? "min" : "mins"}`);
    }

    return result.join(' ');
}

export default addTimeStrings;