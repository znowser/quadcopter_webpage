import socket
import sys
from time import sleep

HOST, PORT = "10.0.1.13", 8090
#data = " ".join(sys.argv[1:])

# Create a socket (SOCK_STREAM means a TCP socket)
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    # Connect to server and send data
    sock.connect((HOST, PORT))
    while True:
        data = raw_input("Mata in din data:")
        sock.sendall(data)
        #sleep(0.5)

    # Receive data from the server and shut down
    #received = sock.recv(1024)
finally:
    sock.close()

print "Sent:     {}".format(data)
print "Received: {}".format(received)