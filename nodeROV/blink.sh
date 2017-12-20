
DIR="/sys/class/gpio/gpio57"

echo out > $DIR/direction

while true; do
        echo "State: 1"
        echo 1 > $DIR/value
        echo "-> 1"
        sleep 1
        echo "State: 0"
        echo 0 > $DIR/value
        echo "-> 0"
	sleep 1
done


