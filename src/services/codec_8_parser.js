const Parser = require('teltonika-parser');
const binutils = require('binutils64');



module.exports = function(hex_data_from_device) {
    let buffer = hex_data_from_device;

    let parser = new Parser(buffer);

    let avl = parser.getAvl();

    // let writer = new binutils.BinaryWriter();
    // writer.WriteInt32(avl.number_of_data);

    // let response = writer.ByteBuffer;
    return avl;
}