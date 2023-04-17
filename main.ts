//% weight=0 color=#004028 icon="\uf135" block="LineTrackingBeetle"
namespace LineTrackingBeetle {
    //% weight=0
    //% blockId="turn_on_fill_light" block="Trun On Fill Light"
    export function turn_on_fill_light(): void {
        let buf: Buffer = pins.createBuffer(2);

        buf[0] = 0x03;
        buf[1] = 0x00;

        pins.i2cWriteBuffer(0x12, buf, false);
    }

    //% weight=0
    //% blockId="turn_off_fill_light" block="Trun Off Fill Light"
    export function turn_off_fill_light(): void {
        let buf: Buffer = pins.createBuffer(2);

        buf[0] = 0x03;
        buf[1] = 0x01;

        pins.i2cWriteBuffer(0x12, buf, false);
    }
}
