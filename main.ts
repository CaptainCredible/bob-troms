

let list = 0
let myOnTime = 0
let portBOnTimes: number[] = []
let portAOnTimes: number[] = []
let pauseLength = 0
//let outputBBuffer = 0
let portBTimers: number[] = []
let portATimers: number[] = []
let flip = false
let myOnTimer = 0
let outPut = 0
//let outputABuffer = 0
let anOutputIsOn = false
let perxles: neopixel.Strip = null
let midiChannel: midi.MidiController = null
let incrementor = 0
let chan = 0
let notes: number[] = []
let muted = false

// TUNED FOR TROMS PANEL!
portAOnTimes = [16, 15, 15, 15, 17, 15, 18, 25] //timer only works in multiples of 6, i.e. 6-12-18-24
portBOnTimes = [19, 19, 19, 19, 13, 19, 25, 19]
portATimers = [0, 0, 0, 0, 0, 0, 0, 0]
portBTimers = [0, 0, 0, 0, 0, 0, 0, 0]

radio.onReceivedValue(function (name, value) {
    if (!muted) {
        if (name == "Bob") {
            if (value < 16 && value > -1) {
                outPut = value
                handleOutput()
                updateMCP23017()

            }

        }
        else if (name == "BobP") {
            bitCheckMask = 1
            for (let i = 0; i <= 16 - 1; i++) {
                if (bitCheckMask & value) {
                    outPut = i
                    handleOutput()
                }
                bitCheckMask = bitCheckMask << 1
            }
            updateMCP23017()
        }
    }

    if (name == "m") {
        /*
        Bob 00000001
        Tim 00000010
        Ted 00000100
        Pat 00001000
        Cat 00010000
        Dad 00100000
        Mum 01000000
        Zim 10000000
        */
        if (value & 0b00000001) {
            muted = true
            basic.showIcon(IconNames.No, 1)
        } else if (muted) {
            muted = false
            basic.clearScreen()
        }
    }

})
function makeSomeNoise() {
    notes = [220, 233, 247, 262, 227, 294, 311, 330, 349, 370, 392, 415, 440, 466, 494, 523, 554]
    music.playTone(notes[15 - myNote], music.beat(BeatFraction.Sixteenth))
}
input.onButtonPressed(Button.A, () => {
    chan += 1
    midiChannel = midi.channel(chan)
})
function updateMCP23017() {
    MCP23017.updateOutputAOn(ADDRESS.A27)
    MCP23017.updateOutputBOn(ADDRESS.A27)
}
function handleMCP23017Out() {
    if (myNote < 8) {
        // serial.writeValue("less than 8", myNote)
        MCP23017.setOutputA(myNote)
        portATimers[myNote] = input.runningTime()
    } else {
        // serial.writeValue("more than 8", myNote)
        MCP23017.setOutputB(myNote - 8)
        portBTimers[myNote - 8] = input.runningTime()
    }
}
function handleMCP23017offs() {
    if (outputABuffer > 0) {
        for (let handleMCP23017offsIndexA = 0; handleMCP23017offsIndexA <= 8 - 1; handleMCP23017offsIndexA++) {
            if (input.runningTime() > portATimers[handleMCP23017offsIndexA] + portAOnTimes[handleMCP23017offsIndexA]) {
                MCP23017.clearOutputA(handleMCP23017offsIndexA)
                MCP23017.updateOutputAOn(ADDRESS.A27)
            }
        }
    }
    if (outputBBuffer > 0) {
        for (let handleMCP23017offsIndexB = 0; handleMCP23017offsIndexB <= 8 - 1; handleMCP23017offsIndexB++) {
            if (input.runningTime() > portBTimers[handleMCP23017offsIndexB] + portBOnTimes[handleMCP23017offsIndexB]) {
                MCP23017.clearOutputB(handleMCP23017offsIndexB)
                MCP23017.updateOutputBOn(ADDRESS.A27)
            }
        }
    }
}
function turnOffAllLeds() {
    perxles.clear()
    perxles.show()
}
function handlePinOuts() {
    pins.digitalWritePin(myPins[myNote], 1)
    anOutputIsOn = true
}

let flipG = false
let flipGsharp = false
let flipA = false
let flipAsharp = false


function handleOutput() {
    if (outPut % 16 < 5) {
        led.plot(0, outPut)
        led.plot(1, outPut)
        led.plot(2, outPut)
        led.plot(3, outPut)
        led.plot(4, outPut)
        myOnTimer = input.runningTime() + myOnTime
    } else if (outPut % 16 < 10) {
        led.plot(outPut - 5, 0)
        led.plot(outPut - 5, 1)
        led.plot(outPut - 5, 2)
        led.plot(outPut - 5, 3)
        led.plot(outPut - 5, 4)
        myOnTimer = input.runningTime() + myOnTime
    }
    /*
    switch (outPut) {
        case 0: //C
            myNote = 5
            break;
        case 1: //C#
            myNote = 6
            break;
        case 2: //D
            myNote = 7
            break;
        case 3: //D#
            myNote = 8
            break;
        case 4: //E
            myNote = 9
            break;
        case 5: //F
            myNote = 10
            break;
        case 6: //F#
            myNote = 11
            break;
        case 7: //G
            if (flipG) {
                myNote = 12
            } else {
                myNote = 0
            }
            flipG = !flipG
            break;
        case 8: //G#
            if (flipGsharp) {
                myNote = 13
            } else {
                myNote = 1
            }
            flipGsharp = !flipGsharp
            break;
        case 9: //A
            if (flipA) {
                myNote = 14
            } else {
                myNote = 2
            }
            flipA = !flipA
            break;
        case 10: //A#
            if (flipAsharp) {
                myNote = 15
            } else {
                myNote = 3
            }
            flipAsharp = !flipAsharp
            break;
        case 11: //B
            myNote = 4
            break;
        case 12: //C
            myNote = 5
            break;
        case 13: //C#
            myNote = 6
            break;
        case 14: //D
            myNote = 7
            break;
        case 15: //D#
            myNote = 8
            break;

    }
    */
    myNote = outPut

    //myNote = 15 - myNote // invert
    handleMCP23017Out()
}
function sendMidi() {
    midiChannel.noteOn(50 - myNote)
    basic.pause(1)
    led.toggle(0, 0)
    midiChannel.noteOff(50 - myNote)
    basic.pause(1)
}
function handleNeoPixies() {
    for (let indeks = 0; indeks <= 2; indeks++) {
        perxles.setPixelColor(myNote + indeks, neopixel.colors(NeoPixelColors.Red))
        perxles.show()
    }
}
let bitCheckMask = 0
let myNote = 0
incrementor = 0
flip = false
pauseLength = 0
serial.redirectToUSB()
myOnTimer = 10

let myPins: number[]
basic.showLeds(`
    # # . # #
    # # . # #
    . . # . .
    . # . # .
    # . . . #
    `)
basic.pause(500)
MCP23017.setPortAsOutput(ADDRESS.A27, SET_PORT.A)
MCP23017.setPortAsOutput(ADDRESS.A27, SET_PORT.B)
myOnTime = 15
myPins = [9, 15, 20, 21, 22, 23]
list = 0
radio.setGroup(83)
music.setTempo(200)
basic.forever(() => {
    if (input.runningTime() > myOnTimer) {
        if (!muted) {
            basic.clearScreen()
        } else {
            basic.showIcon(IconNames.No, 1)
        }
        led.plot(0, 0)
        // turnOffAllLeds()
        for (let offIndex = 0; offIndex <= 6 - 1; offIndex++) {
            pins.digitalWritePin(myPins[offIndex], 0)
        }
        anOutputIsOn = false
    }
})
control.inBackground(() => {
    while (true) {
        handleMCP23017offs()
        basic.pause(1)
    }
})
