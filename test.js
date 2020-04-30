var assert = require('assert');
var nmea_checksum = require('.');

assert.equal(nmea_checksum.checksum('PMTK300,10000,0,0,0,0'), '2C');
assert.equal(nmea_checksum.checksum('$PMTK300,10000,0,0,0,0'), '2C');

assert.equal(nmea_checksum.checksum('PMTK300,10000,0,0,0,0'), '2C');
assert.equal(nmea_checksum.wrap('PMTK300,10000,0,0,0,0'), '$PMTK300,10000,0,0,0,0*2C');
assert.equal(nmea_checksum.strip('$PMTK300,10000,0,0,0,0*28'), 'PMTK300,10000,0,0,0,0');
assert.equal(nmea_checksum.isValid('$PMTK300,10000,0,0,0,0*2C'), true);
assert.equal(nmea_checksum.isValid('$PMTK300,10000,0,0,0,0*42'), false);

assert.equal(
    nmea_checksum.addTimestampTag(
        new Date(1588213666000),
        '\\c:1588213666*5B\\!AIVDM,2,1,3,B,544cvC020I@mD88S800Hh4pA8T4000000000001@7hC695=`0<Tl0P000000,0*1C',
    ),
    '\\c:1588213666*5B\\!AIVDM,2,1,3,B,544cvC020I@mD88S800Hh4pA8T4000000000001@7hC695=`0<Tl0P000000,0*1C',
    'expected a message with existing timestamp to not be modified',
);

assert.equal(
    nmea_checksum.addTimestampTag(
        new Date(1588213666000),
        '!AIVDM,2,1,3,B,544cvC020I@mD88S800Hh4pA8T4000000000001@7hC695=`0<Tl0P000000,0*1C',
    ),
    '\\c:1588213666*5B\\!AIVDM,2,1,3,B,544cvC020I@mD88S800Hh4pA8T4000000000001@7hC695=`0<Tl0P000000,0*1C',
    'expected to have added the timestamp to a message missing it',
);

assert.equal(
    nmea_checksum.addTimestampTag(
        new Date(1588213666000),
        '!AIVDM,2,1,3,B,544cvC020I@mD88S800Hh4pA8T4000000000001@7hC695=`0<Tl0P000000,0*1C\n!AIVDM,2,2,3,B,00000000000,2*24',
    ),
    '\\c:1588213666*5B\\!AIVDM,2,1,3,B,544cvC020I@mD88S800Hh4pA8T4000000000001@7hC695=`0<Tl0P000000,0*1C\n\\c:1588213666*5B\\!AIVDM,2,2,3,B,00000000000,2*24',
    'expected to have added the timestamp to each sentence',
);

assert.equal(
    nmea_checksum.addTimestampTag(
        new Date(1588213666000),
        '!AIVDM,2,1,3,B,544cvC020I@mD88S800Hh4pA8T4000000000001@7hC695=`0<Tl0P000000,0*1C !AIVDM,2,2,3,B,00000000000,2*24',
    ),
    '\\c:1588213666*5B\\!AIVDM,2,1,3,B,544cvC020I@mD88S800Hh4pA8T4000000000001@7hC695=`0<Tl0P000000,0*1C \\c:1588213666*5B\\!AIVDM,2,2,3,B,00000000000,2*24',
    'expected to also do it when each line is split by spaces, and return split by space',
);
