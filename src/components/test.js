let sundayStart1 = "09:00:00"
let sundayStart2 = "09:00:00"
let sundayEnd1 = "17:00:00"
let sundayEnd2 = "17:00:00"
let sundayChecked = true
let mondayStart1 = "09:00:00"
let mondayStart2 = "09:00:00"
let mondayEnd1 = "17:00:00"
let mondayEnd2 = "17:00:00"
let mondayChecked = true
let tuesdayStart1 = "09:00:00"
let tuesdayStart2 = "09:00:00"
let tuesdayEnd1 = "17:00:00"
let tuesdayEnd2 = "17:00:00"
let tuesdayChecked = true
let wednesdayStart1 = "09:00:00"
let wednesdayStart2 = "09:00:00"
let wednesdayEnd1 = "17:00:00"
let wednesdayEnd2 = "17:00:00"
let wednesdayChecked = true
let thursdayStart1 = "09:00:00"
let thursdayStart2 = "09:00:00"
let thursdayEnd1 = "17:00:00"
let thursdayEnd2 = "17:00:00"
let thursdayChecked = true
let fridayStart1 = "05:00:00"
let fridayStart2 = "09:00:00"
let fridayEnd1 = "17:00:00"
let fridayEnd2 = "17:00:00"
let fridayChecked = true
let saturdayStart1 = "05:00:00"
let saturdayStart2 = "05:00:00"
let saturdayEnd1 = "13:00:00"
let saturdayEnd2 = "13:00:00"
let saturdayChecked = false
const scheduleConfig = [
    { start1: sundayStart1, end1: sundayEnd1, start2: sundayStart2, end2: sundayEnd2, checked: sundayChecked }, // sunday
    { start1: mondayStart1, end1: mondayEnd1, start2: mondayStart2, end2: mondayEnd2, checked: mondayChecked }, // monday
    { start1: tuesdayStart1, end1: tuesdayEnd1, start2: tuesdayStart2, end2: tuesdayEnd2, checked: tuesdayChecked }, // tuesday
    { start1: wednesdayStart1, end1: wednesdayEnd1, start2: wednesdayStart2, end2: wednesdayEnd2, checked: wednesdayChecked }, // wednesday
    { start1: thursdayStart1, end1: thursdayEnd1, start2: thursdayStart2, end2: thursdayEnd2, checked: thursdayChecked }, // thursday
    { start1: fridayStart1, end1: fridayEnd1, start2: fridayStart2, end2: fridayEnd2, checked: fridayChecked }, // friday
    { start1: saturdayStart1, end1: saturdayEnd1, start2: saturdayStart2, end2: saturdayEnd2, checked: saturdayChecked }, // saturday
];
function getUTC(time) {
    // Convert local time to UTC hours, handling negative hours with modulo
    return (parseInt(time.split(":")[0]) - 8 ) % 24;
  }
  
  function getActiveDays(config) {
    const activeDays = new Set(); // Use a Set to avoid duplicates
  
    config.forEach((day, index) => {
      const prevDayIndex = (index - 1 + 7) % 7; // Previous day index (wraps around)
      const nextDayIndex = (index + 1) % 7; // Next day index (wraps around)
      const prevDay = config[prevDayIndex];
      const nextDay = config[nextDayIndex];
  
      // Check start1 and end1 for current and previous day
      if (getUTC(day.start1) >= 0 && !day.checked) activeDays.add(index+1); // Positive portion for current day
      if (getUTC(day.start1) < 0 && prevDay.checked && !day.checked) activeDays.add(prevDayIndex+1);  // Negative portion for previous day
      if (getUTC(day.start2) >= 0 && !day.checked) activeDays.add(index+1); // Positive portion for current day
      if (getUTC(day.start2) < 0 && prevDay.checked && !day.checked) activeDays.add(prevDayIndex+1); // Negative portion for previous day
      //console.log(getUTC(day.start1), getUTC(day.start1) >= 0, !day.checked, prevDayIndex+1)
      console.log(getUTC(day.start1), getUTC(day.start1) < 0, !prevDay.checked, !day.checked, prevDayIndex+1)
      if (getUTC(day.end1) >= 0 && !day.checked) activeDays.add(index+1); // Positive portion for current day
      if (getUTC(day.end1) < 0 && !prevDay.checked) activeDays.add(prevDayIndex+1); // Negative portion for previous day
       //Check start2 and end2 for current and previous day
      if (getUTC(day.end2) >= 0 && !day.checked) activeDays.add(index+1); // Positive portion for current day
      if (getUTC(day.end2) < 0 && !prevDay.checked) activeDays.add(prevDayIndex+1); // Negative portion for previous day
      
    });
  
    return Array.from(activeDays).sort().join(","); // Convert Set to sorted array and join as a string
  }

let createData = {
    "action": "create",
    "campaign": "Sales",
    "startTime": "9",
    "endTime": "17",
    "days": getActiveDays(scheduleConfig),
    "year": "*"
}
console.log(createData)