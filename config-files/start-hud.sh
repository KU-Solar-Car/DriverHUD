#!/bin/sh
# This script is run by ~/.config/lxsession/LXDE-pi/autostart
# For some reason putting these commands in that file directly doesn't work correctly
# (both browsers open on the same display)

export DISPLAY=:0
chromium-browser http://localhost:5000/static/index.html --kiosk --new-window --user-data-dir=/tmp/browser1 --disable-web-security &
chromium-browser http://localhost:5000/static/dashcam.html --kiosk --new-window --window-position="800,0" --user-data-dir=/tmp/browser2 --use-fake-ui-for-media-stream --disable-web-security &
