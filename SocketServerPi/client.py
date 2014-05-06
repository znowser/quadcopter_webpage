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
        b1 = random.randint(0, 100)
        b2 = random.randint(0, 100)
        b3 = random.randint(0, 100)
        
        e1 = random.randint(0, 100)
        e2 = random.randint(0, 100)
        e3 = random.randint(0, 100)
        e4 = random.randint(0, 100)
        
        t = random.randint(12, 40)
        a = random.randint(90, 120)
        
        x = random.randint(0, 360)
        y = random.randint(0, 360)
        z = random.randint(0, 360)
        
        
        data = "b1:" + str(b1) + "!b2:" + str(b2) + "!b3:" + str(b3) + "!e1:" + str(e1) + "!e2:" + str(e2) + "!e3:" + str(e3) + "!e4:" + str(e4) + "!t:" + str(t) + "!a:" + str(a) + "!x:" + str(x) + "!y:" + str(y) + "!z:" + str(z) + "!"
        print(data)
        sock.sendall(data)
        sleep(0.5)

    # Receive data from the server and shut down
    #received = sock.recv(1024)
finally:
    sock.close()

print "Sent:     {}".format(data)
print "Received: {}".format(received)