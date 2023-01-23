//exports the getDate function to be used in different files.
exports.getDate = () => {
    //gets the date
    const fullDate = new Date();
    //options of what we want to display
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    //formats the date
    const formatter = new Intl.DateTimeFormat('en', options);
    //outputs the day
    return day = formatter.format(fullDate);
}


//same thing as the previous
exports.getDay = () => {
    const today = new Date();
    const options = { weekday: 'long' };
    const formatter = new Intl.DateTimeFormat('en', options);
    return day = formatter.format(today);
}