# DriverHUD

Displays information in the car for the driver to see such as speed, battery, and the rearview camera. Designed to run on two 800x480 resolution displays in the chromium browser on a Raspberry Pi 4. Requires flask to run (`pip3 install flask`).

## Config files

These are files that need to be configured throughout the OS for the DriverHUD to work

- **config.txt**: This configures the resolution of the displays. *Append* to the existing file in `/boot` (can also be accessed on microSD directly in Windows).
- **driverhud-flask.service**: This is used to automatically start the Flask server on boot. Place in `/lib/systemd/system/`.
- **autostart**: This removes the cursor (`sudo apt-get install unclutter`) and prevents screen saver. Place in `/home/pi/.config/lxsession/LXDE-pi` (may need to create some of those directories)
- **start-hud.sh**: This is called by autostart and opens a chromium browser in fullscreen to the correct URL on each monitor. Place in `/home/pi`.
- **hostapd.conf**: Optional, for broadcasting WiFi from the car for remote development/debugging when away from WiFi
    - Based on [this tutorial](https://hawksites.newpaltz.edu/myerse/2018/06/08/hostapd-on-raspberry-pi/).
	- `sudo apt-get install hostapd`
	- Place config file in `/etc/hostapd/` and set a better password.
	- `systemctl unmask hostapd` `systemctl enable hostapd` `systemctl stat hostapd`
- **sudo_crontab** and **hostapd-fixer.sh**: Optional, janky script to make hostapd restart a couple times if it fails to initialize a hotspot
    - Append the contents of **sudo_crontab** to `sudo crontab`
	- Place **hostapd-fixer.sh** in `/home/pi` and `chmod 0777` the script
- **/etc/modules**: Add `mcp251x` to this file

## FYI: VSCode remote SSH server

Apparently the VSCode remote SSH server uses so many system resources that it can freeze a Raspberry Pi. To fix this, [disable JavaScript autocomplete](https://medium.com/good-robot/use-visual-studio-code-remote-ssh-sftp-without-crashing-your-server-a1dc2ef0936d).