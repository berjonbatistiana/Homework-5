function calendar(){
    this.calendar = 
    [ 
        {'time':'00:00', 'event':'', 'is_office_hour': false}, {'time':'01:00', 'event':'', 'is_office_hour': false}, 
        {'time':'02:00', 'event':'', 'is_office_hour': false}, {'time':'03:00', 'event':'', 'is_office_hour': false}, 
        {'time':'04:00', 'event':'', 'is_office_hour': false}, {'time':'05:00', 'event':'', 'is_office_hour': false}, 
        {'time':'06:00', 'event':'', 'is_office_hour': false}, {'time':'07:00', 'event':'', 'is_office_hour': false}, 
        {'time':'08:00', 'event':'', 'is_office_hour': false}, {'time':'09:00', 'event':'', 'is_office_hour': true}, 
        {'time':'10:00', 'event':'', 'is_office_hour': true}, {'time':'11:00', 'event':'', 'is_office_hour': true}, 
        
        {'time':'12:00', 'event':'', 'is_office_hour': true}, {'time':'13:00', 'event':'', 'is_office_hour': true}, 
        {'time':'14:00', 'event':'', 'is_office_hour': true}, {'time':'15:00', 'event':'', 'is_office_hour': true}, 
        {'time':'16:00', 'event':'', 'is_office_hour': true}, {'time':'17:00', 'event':'', 'is_office_hour': true},
        {'time':'18:00', 'event':'', 'is_office_hour': false}, {'time':'19:00', 'event':'', 'is_office_hour': false}, 
        {'time':'20:00', 'event':'', 'is_office_hour': false}, {'time':'21:00', 'event':'', 'is_office_hour': false}, 
        {'time':'22:00', 'event':'', 'is_office_hour': false}, {'time':'23:00', 'event':'', 'is_office_hour': false}
    ];
}

const timeArr = new calendar().calendar;

const calendarLocalKey = 'calendar';
const workdayLocalKey = 'current_workday';

let day = moment().format('MMMM DD Y')
let hour = moment().format('H'); 
let timeIndex = parseInt(hour); // time index

let $currentDay = $('#currentDay');
let $dayCalendar = $('.day-calendar > tbody');
let $timeRow = $('.time-row');

// saving array calendar into the localstorage
function saveCalendarLocal(){
    localStorage.setItem(calendarLocalKey, JSON.stringify(timeArr));
}

// loading array calendar into the localstorage. checks if it exists first and only loads if it does
function loadCalenedarLocal(){
    let loadedCalendar = JSON.parse(localStorage.getItem(calendarLocalKey));
    
    if (!loadedCalendar){
        return;
    }
    timeArr.length = 0;

    loadedCalendar.forEach(element => {
        timeArr.push(element);
    });
}

// resets the calendar to have empty events
function resetCalendar(){
    localStorage.setItem(calendarLocalKey, JSON.stringify((new calendar()).calendar));
    loadCalenedarLocal();
}

// saving into array
function setCalendarEventFromHour(hour){
    let $selectedTimeRow = $(`tr[data-index='${hour}'`);
    timeArr[hour].event = $selectedTimeRow.find('.event-textarea').val();
}

// loading from array
// hour is equivalent to the timearray index
function getCalendarEventFromHour(hour){
    let timeObject = timeArr[hour];
    let $selectedTimeRow = $(`tr[data-index='${hour}'`);
    let eventText = $selectedTimeRow.find('.event-textarea').val();

    timeObject.event = eventText;
}

// clear contents from an hour
function clearCalendarEventFromHour(hour){
    let timeObject = timeArr[hour];
    let $selectedTimeRow = $(`tr[data-index='${hour}'`);
    $selectedTimeRow.find('.event-textarea').val('');

    timeObject.event = '';
}

// checks if the day is new, if true clear the array contents and start over
function setNewDay(){

    let workdayLocalStorage = localStorage.getItem(workdayLocalKey);

    // If new day, reset calendar
    if (!workdayLocalStorage || localStorage.getItem(workdayLocalKey) !== day){
        localStorage.setItem(workdayLocalKey, day);
        resetCalendar();
    }

}


// button events

// delagated on click catcher
$dayCalendar.on('click', function(e){
    e.preventDefault();

    // catch a button in the calendar
    if (e.target.matches('button')){
        let $buttonType = $(e.target);
        let targetIndex = $buttonType.parent().parent().attr('data-index');

        if ($buttonType.hasClass('save-btn')){
            setCalendarEventFromHour(targetIndex);
            saveCalendarLocal();
        } else if ($buttonType.hasClass('del-btn')){
            clearCalendarEventFromHour(targetIndex);
            saveCalendarLocal();
        }
    }
});

// Let this run when the page loads to render the whole calendar

// checks the day and clears the local storage calendar if new day
setNewDay();

// loads the calendar from the local storage to the array
loadCalenedarLocal();

// displays the current day as text
$currentDay.text(day);

// creates the html elements for the calendar and prefills the event textbox if an entry exists
timeArr.forEach((time,i) => {
    if (i === 0){return;} // skip first item in the array because it is already attached in the html file

    let classModifier = '';
 
    // clone the existing row of hour and creates a new one with a new hour
    let $newTimeRow = $timeRow.clone();
    let $newTextarea = $newTimeRow.children('.event-text').children('.event-textarea');
    $newTimeRow.attr('data-index', i);
    $newTimeRow.children('.time-indicator').children('p').text(time.time);
    
    // checks if the hour has passed or not and adds the necessary attribute
    if (i < timeIndex){
        classModifier+= 'time-passed';
        $newTextarea.attr('disabled', true);
    } else if (i === timeIndex) {
        classModifier+= 'time-current';
    }

    // set text, add class, append to html
    $newTextarea.text(time.event);
    $newTimeRow.addClass(classModifier);

    if (time.is_office_hour){
        $dayCalendar.append($newTimeRow);
    }
    
});

// checks the hour 0:00 if it has passed or not
if (timeIndex !== 0){
    $timeRow.addClass('time-passed');
    $timeRow.find('.event-textarea').attr('disabled', true);
} else {
    $timeRow.addClass('time-current');
}

// sets an event for hour 0:00 if it exists (most likely, this will contain nothing)
$timeRow.children('.event-text').children('.event-textarea').text(timeArr[0].event);