#!/bin/sh

# Super janky script to make hostapd work
# Called from `sudo crontab` multiple times after boot

if (sudo service hostapd status | tail -n 5 | grep --quiet "Could not connect to kernel driver"); then
  sudo service hostapd restart
  echo "fail" >> /home/pi/hostapd-fixer.txt
else
  echo "good" >> /home/pi/hostapd-fixer.txt
fi

