import socket
import sys
from time import sleep
import random

HOST, PORT = "127.0.0.1", 8091
#data = " ".join(sys.argv[1:])

# Create a socket (SOCK_STREAM means a TCP socket)
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    # Connect to server and send data
    sock.connect((HOST, PORT))
    while True:
        x = random.randint(0, 360)
        y = random.randint(0, 360)
        z = random.randint(0, 360)
        
        data = "x:" + str(x) + "!y:" + str(y) + "!z:" + str(z) + "!"
        print(data)
        sock.sendall(data)
        sleep(0.5)

    # Receive data from the server and shut down
    #received = sock.recv(1024)
finally:
    sock.close()

print "Sent:     {}".format(data)
print "Received: {}".format(received)