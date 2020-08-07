let now = moment().format('H'); 
let timeIndex = parseInt(now); // time index

let $dayCalendar = $('.day-calendar > tbody')
let $timeRow = $('.time-row');

let timeArr = [ '00:00', '01:00','02:00','03:00','04:00','05:00','06:00',
                '07:00','08:00','09:00','10:00','11:00','12:00','13:00',
                '14:00','15:00','16:00','17:00','18:00','19:00','20:00',
                '21:00','22:00','23:00'];

timeArr.forEach((time,i) => {
    if (i === 0){return;} // skip first item in the array

    let classModifier = '';
 
    let $newTimeRow = $timeRow.clone();
    $newTimeRow.attr('data-index', i);
    $newTimeRow.children('.time-indicator').children('p').text(time);
    
    if (i < timeIndex){
        classModifier+= 'time-passed';
        $newTimeRow.children('.event-text').children('.event-textarea').attr('disabled', true);
    } else if (i === timeIndex) {
        classModifier+= 'time-current';
    }
    
    $newTimeRow.addClass(classModifier);
    $dayCalendar.append($newTimeRow);
    
});

if (timeIndex !== 0){
    $timeRow.addClass('time-passed');
} else {
    $timeRow.addClass('time-current');
}