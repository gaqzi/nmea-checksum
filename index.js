function checksum(_command) {
    var command = _command[0] === '$' ? _command.slice(1) : _command;

    var checksum = 0;
    for(var i = 0; i < command.length; i++) {
        checksum = checksum ^ command.charCodeAt(i);
    }

    var hex = Number(checksum).toString(16).toUpperCase();
    if (hex.length < 2) {
        hex = ("00" + hex).slice(-2);
    }

    return hex;
}

function wrap(_command) {
    var command = _command[0] === '$' ? _command.slice(1) : _command;

    return '$' + command + '*' + checksum(command);
}

function strip(_command) {
    return _command.slice(1).slice(0, -3);
}

function isValid(_command) {
    var _checksum = _command.slice(-2);

    var command = strip(_command);

    return _checksum === checksum(command);
}

/* Given a NMEA sentence that doesn't start with \c assume it doesn't have any tags
   and generate a checksum and prepend it to each line of input.

   In testing I noticed cases where we had lines split by spaces as well as newlines,
   not sure if this is just BQ formatting or something else.
   */
function addTimestampTag(timestamp, nmea) {
    if(nmea.startsWith('\\c')) return nmea;

    var splitBy = nmea.includes('\n') ? '\n' : ' ',
        nmeaLines = nmea.split(splitBy),
        sentences = [];

    for(var i = 0;i < nmeaLines.length;i++) {
        sentences.push(generateTsChecksumInSentence(timestamp, nmeaLines[i]));
    }

    return sentences.join(splitBy);
}

function generateTsChecksumInSentence(timestamp, nmea) {
    var unixTs = timestamp.getTime() / 1000,
        tsComment = 'c:' + unixTs;

    return '\\' + tsComment + '*' + checksum(tsComment) + '\\' + nmea;
}

// module isn't available on BQ, and to make this just uploadable to a bucket
if(typeof module !== 'undefined') {
    module.exports = {
        checksum: checksum,
        addTimestampTag: regenerateChecksum,
        wrap: wrap,
        strip: strip,
        isValid: isValid
    };
}
