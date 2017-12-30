
DIR="/sys/class/gpio/gpio57"


STATE=`cat $DIR/value`

echo out > $DIR/direction
echo $STATE > $DIR/value

while true; do
        STATE=`cat $DIR/value`
	if [ $STATE ]; then
	        echo 1 > $DIR/value
	        echo "i set the line"
	        sleep 1
	        echo "i gave up the line"
	        echo 0 > $DIR/value
	fi
	sleep 1
done


