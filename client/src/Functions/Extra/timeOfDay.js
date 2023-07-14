import React from 'react';

const TimeOfDay = () => {
    const myDate = new Date();
    var timeOfDay;
    const currentHour = myDate.getHours();

    if (currentHour < 12){
        timeOfDay = 'Good Morning';
    } else if (currentHour >= 12 && currentHour <= 17){
        timeOfDay = 'Good Afternoon';
    } else if (currentHour > 17 && currentHour <= 24){
        timeOfDay = 'Good Evening';
    };

    return timeOfDay;
}

export default TimeOfDay;
