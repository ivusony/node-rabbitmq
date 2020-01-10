 # NODEJS Listener service for F1 project.

* main server/listener script /app/listener.js

* Listener uses Sender  in /services/sender.js which sends messages to exchange/queue.

* Consumer in /services/consumer.js connects to remote exhange/queue and consumes the messages

* Fake FMB140 socket in Test used for fakeing IMEI => AVL communication with server 