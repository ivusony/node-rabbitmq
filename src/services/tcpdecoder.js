const teltonika_codec8_parser = require('./codec_8_parser');

class TCP_DECODER {
    constructor(hex_data){
        this.hex_data = hex_data;
    }

    isDeviceAuthenticating = () => {
        // https://wiki.teltonika.lt/view/Codec
        // when module connects to server, module sends its IMEI. First comes short identifying number of bytes written and then goes IMEI as text (bytes). 
        // First two bytes denote IMEI length.
        var first_two_Bytes = this.hex_data.slice(0, 2).toString('hex');
        var int = parseInt(first_two_Bytes, 16);
        // return true if first two bytes (IMEI length) is greater than 0
        return int > 0
    }

    decode_AVL = (cb) => {
        return teltonika_codec8_parser(this.hex_data)
    }

    data_length = () => {
        var data =  this.decode_AVL(this.hex_data);
        return data.number_of_data2
    }

    hex2a = (hexx) => {
        var hex = hexx.toString();//force conversion
        var str = '';
        for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        return str;
    }
}


module.exports = TCP_DECODER;