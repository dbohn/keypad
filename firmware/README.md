This is the firmware to run in combination with the keypad app.

Make sure, the following requirements are met:

* Flash your Raspberry Pi Pico with (at least) CircuitPython 6.2.0-beta.3. This is required, as we use the new usb_cdc module to use the secondary serial connection.
* Create a lib folder on the CIRCUITPY drive and put these two libraries from the latest [libraries bundle](https://circuitpython.org/libraries) for CircuitPython 6.x.x:
  * adafruit_bus_drive
  * adafruit_dotstar (not, that this is a single .mpy file!)
* Replace the default code.py file with the code.py file in this directory