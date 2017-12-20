
DIR="/sys/class/gpio/gpio57"

#echo in > $DIR/direction

while true; do
	cat $DIR/value;
	sleep .5
done

