//% weight=0 color=#004028 icon="\uf135" block="LineTrackingBeetle"
namespace LineTrackingBeetle {
    let WB_RGB = [0.52,1,1]
    let LINE_THRESHOLD = 150


    //% weight=0
    //% blockId="turn_on_fill_light" block="Trun On Fill Light"
    export function turn_on_fill_light(): void {
        let buf = pins.createBuffer(2);

        buf[0] = 0x03;
        buf[1] = 0x00;

        pins.i2cWriteBuffer(0x12, buf);
    }


    //% weight=0
    //% blockId="turn_off_fill_light" block="Trun Off Fill Light"
    export function turn_off_fill_light(): void {
        let buf = pins.createBuffer(2);

        buf[0] = 0x03;
        buf[1] = 0x01;

        pins.i2cWriteBuffer(0x12, buf);
    }


    //% weight=0
    //% blockId="initialize_color_sensor" block="Initialize Color Sensor"
    export function initialize_color_sensor(): void {
        let buf = pins.createBuffer(2);

        buf[0] = 0x80;
        buf[1] = 0x03;
        pins.i2cWriteBuffer(0x39, buf);

        basic.pause(10)

        buf[0] = 0x81;
        buf[1] = 0xD5;
        pins.i2cWriteBuffer(0x39, buf);

        buf[0] = 0x8F;
        buf[1] = 0x01;
        pins.i2cWriteBuffer(0x39, buf);
    }


    //% weight=0
    //% blockId="get_color" block="Measure Color"
    export function get_color(): number {
        pins.i2cWriteNumber(0x39, 0x96, NumberFormat.Int8LE)
        let buf = pins.i2cReadBuffer(0x39, 6)

        let color_r = buf[1]*256 + buf[0]
        let color_g = buf[3]*256 + buf[2]
        let color_b = buf[5]*256 + buf[4]
        color_r = Math.floor(color_r/WB_RGB[0])
        color_g = Math.floor(color_g/WB_RGB[1])
        color_b = Math.floor(color_b/WB_RGB[2])

        let maxColor = max(color_r, color_g, color_b)
        if(maxColor > 255) {        
            let scale = 255 / maxColor
            color_r = Math.floor(color_r * scale)
            color_g = Math.floor(color_g * scale)
            color_b = Math.floor(color_b * scale)
        }

        return (color_b + color_g * 256 + color_r * 65536);
    }
}
