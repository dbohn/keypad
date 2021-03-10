import time
import board
import busio
import supervisor
import sys
import usb_cdc

from adafruit_bus_device.i2c_device import I2CDevice
import adafruit_dotstar

from digitalio import DigitalInOut, Direction, Pull

# Pull CS pin low to enable level shifter
cs = DigitalInOut(board.GP17)
cs.direction = Direction.OUTPUT
cs.value = 0

# Set up APA102 pixels
num_pixels = 16
pixels = adafruit_dotstar.DotStar(board.GP18, board.GP19, num_pixels, brightness=0.2, auto_write=True)

# Set up I2C for IO expander (addr: 0x20)
i2c = busio.I2C(board.GP5, board.GP4)
device = I2CDevice(i2c, 0x20)

serial = usb_cdc.serials[1]

# Read button states from the I2C IO expander on the keypad
def read_button_states(x, y):
    pressed = [0] * 16
    with device:
        # Read from IO expander, 2 bytes (8 bits) correspond to the 16 buttons
        device.write(bytes([0x0]))
        result = bytearray(2)
        device.readinto(result)
        b = result[0] | result[1] << 8

        # Loop through the buttons
        for i in range(x, y):
            if not (1 << i) & b:
                pressed[i] = 1
            else:
                pressed[i] = 0
    return pressed

# Define initial values for the global variables
held = [0] * 16
readLineBuffer = ""

# Read button press
def readButton():
	pressed = read_button_states(0, 16)
	for i in range(16):
		if pressed[i]:
			if not held[i]:
				logMessage("d{0}".format(i))
				held[i] = 1
		else:
			if held[i]:
				logMessage("u{0}".format(i))
			held[i] = 0

# Print the message to the serial console
def logMessage(message):
	global serial
	serial.write((message + "\n").encode())

def non_blocking_read():
	global serial
	i = ""
	while serial.in_waiting > 0:
		i += serial.read(serial.in_waiting).decode()
	return i

def readline():
	global readLineBuffer
	char = non_blocking_read()
	if len(char) == 0 and len(readLineBuffer) == 0:
		return
	readLineBuffer = readLineBuffer + char
	newLineIndex = readLineBuffer.find('\n')
	if newLineIndex != -1:
		copy = readLineBuffer[:newLineIndex]
		readLineBuffer = readLineBuffer[(newLineIndex + 1):]
		return copy

def parseCommand(command):
	if command[0] == 'c':
		values = command[1:].split(",")
		if len(values) < 4:
			return
		button = int(values[0])
		if button < 0 or button > 15:
			return
		pixels[button] = (int(values[1]), int(values[2]), int(values[3]))

while True:
	receivedString = readline()
	if (receivedString and len(receivedString.strip()) > 0):
		parseCommand(receivedString.strip())
	readButton()
	time.sleep(0.001)