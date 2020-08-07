let $dayCalendar = $('.day-calendar > tbody')
let $timeRow = $('.time-row');

let timeArr = [ '01:00','02:00','03:00','04:00','05:00','06:00',
                '07:00','08:00','09:00','10:00','11:00','12:00','13:00',
                '14:00','15:00','16:00','17:00','18:00','19:00','20:00',
                '21:00','22:00','23:00'];

timeArr.forEach((time,i) => {
    let $newTimeRow = $timeRow.clone();
    $newTimeRow.attr('data-index', i+1);
    $newTimeRow.children('.time-indicator').children('p').text(time);
    $dayCalendar.append($newTimeRow);
});