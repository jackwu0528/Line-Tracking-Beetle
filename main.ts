let WB_RGB = [0.52, 1, 1];
let LINE_THRESHOLD = 150;

const enum Servos {
    //% blockId="S1" block="Lift (S1)"
    lift_servo = 0,
    //% blockId="S2" block="Gripper (S2)"
    gripper_servo = 1
}

const enum Color {
    //%block="Red"
    RED = 1,
    //%block="Green"
    GREEN = 2,
    //%block="Blue"
    BLUE = 3,
    //%block="Black"
    BLACK = 4,
    //%block="White"
    WHITH = 5,
    //%block="Others"
    OTHERS = 6
}

const enum Patrol {
    //%block="Leftmost (Q1)"
    Q1 = 33,
    //%block="Left (Q2)"
    Q2 = 34,
    //%block="Right (Q3)"
    Q3 = 35,
    //%block="Rightmost (Q4)"
    Q4 = 36
}

//% weight=0 color=#c7a22b icon="\uf135" block="Maqueen Mechanic-Beetle"
namespace MaqueenMechanicBeetle {
    //% weight=95
    //% blockId=servo_run block="Servo|%index|Angle|%angle (0~90)"
    //% angle.min=0 angle.max=90
    //% index.fieldEditor="gridpicker" index.fieldOptions.columns=2
    export function servo_run(index: Servos, angle: number): void {
        let buf = pins.createBuffer(2);
        if (index == 0) {
            buf[0] = 0x14;
        }
        if (index == 1) {
            buf[0] = 0x15;
        }
        buf[1] = angle;
        pins.i2cWriteBuffer(0x10, buf);
    }


    //% weight=90
    //% blockId="turn_on_fill_light" block="Trun On Fill Light"
    export function turn_on_fill_light(): void {
        let buf = pins.createBuffer(2);

        buf[0] = 0x03;
        buf[1] = 0x00;

        pins.i2cWriteBuffer(0x12, buf);
    }


    //% weight=85
    //% blockId="turn_off_fill_light" block="Trun Off Fill Light"
    export function turn_off_fill_light(): void {
        let buf = pins.createBuffer(2);

        buf[0] = 0x03;
        buf[1] = 0x01;

        pins.i2cWriteBuffer(0x12, buf);
    }


    //% weight=80
    //% blockId="initialize_color_sensor" block="Initialize Color Sensor"
    export function initialize_color_sensor(): void {
        let buf = pins.createBuffer(2);

        buf[0] = 0x80;
        buf[1] = 0x03;
        pins.i2cWriteBuffer(0x39, buf);

        basic.pause(10);

        buf[0] = 0x81;
        buf[1] = 0xD5;
        pins.i2cWriteBuffer(0x39, buf);

        buf[0] = 0x8F;
        buf[1] = 0x01;
        pins.i2cWriteBuffer(0x39, buf);
    }


    //% weight=75
    //% blockId="get_color" block="Get Color Sensor Value"
    export function get_color(): number {
        pins.i2cWriteNumber(0x39, 0x96, NumberFormat.UInt8LE)
        let buf = pins.i2cReadBuffer(0x39, 6);

        let color_r = buf[1] * 256 + buf[0];
        let color_g = buf[3] * 256 + buf[2];
        let color_b = buf[5] * 256 + buf[4];
        color_r = Math.floor(color_r / WB_RGB[0]);
        color_g = Math.floor(color_g / WB_RGB[1]);
        color_b = Math.floor(color_b / WB_RGB[2]);

        let maxColor = Math.max(color_r, Math.max(color_g, color_b));
        if (maxColor > 255) {
            let scale = 255 / maxColor;
            color_r = Math.floor(color_r * scale);
            color_g = Math.floor(color_g * scale);
            color_b = Math.floor(color_b * scale);
        }

        return (color_b + color_g * 256 + color_r * 65536);
    }


    //% weight=70
    //%block="Get Line-Tracking Sensor State"
    export function get_line_tracking(): number {
        let line = 0;
        pins.i2cWriteNumber(0x12, 33, NumberFormat.UInt8LE);
        let buf = pins.i2cReadBuffer(0x12, 4);
        if(buf[0] > LINE_THRESHOLD)
        {
            line |= 0x8;
        }
        if(buf[1] > LINE_THRESHOLD)
        {
            line |= 0x4;
        }
        if(buf[2] > LINE_THRESHOLD)
        {
            line |= 0x2;
        }
        if(buf[3] > LINE_THRESHOLD)
        {
            line |= 0x1;
        }

        return line;
    }
}