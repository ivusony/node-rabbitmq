 # NODEJS Listener service for F1 project.

* main server file /app/listener.js

* sender function in /services/sender.js which actually sends messages to exchange/queue. Imported in listener

* consumer function in /services/consumer.js which connects to remote exhange/queue and consumes the messages