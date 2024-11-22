#!/bin/bash

cleanup() {
    echo "Terminating executables..."
    pkill bun
    pkill vite
}

cd server && (bun index.ts > /dev/null) &

cd front && (bun run tauri dev > /dev/null) &


echo Press 'Ctrl-D' or 'q' to exit

stty -echo -icanon time 0 min 1
while true; do
    char=$(dd bs=1 count=1 2>/dev/null)
    if [ -z "$char" ]; then
        break
    fi
    if [ "$char" == "q" ]; then
        break
    fi
done
stty sane

cleanup