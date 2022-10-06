const moment = require('moment');

// Adds time of the msg send to the object
function formatMessage(username,text){
    return{
        username,
        text,
        time: moment().utcOffset("+05:30").format('h:mm a')
    };
}


module.exports = formatMessage;