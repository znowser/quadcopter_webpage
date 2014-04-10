import socket
import sys
from time import sleep
import asyncore
import collections

HOST, PORT = "localhost", 8080
data ="hej"

class Client(asyncore.dispatcher):

    def __init__(self, host_address, port, name):
        asyncore.dispatcher.__init__(self)
        #self.log = logging.getLogger('Client (%7s)' % name)
        self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
        self.name = name
        #self.log.info('Connecting to host at %s', host_address)
        self.connect((host_address, port))
        self.outbox = collections.deque()

    def say(self, message):
        #self.outbox.append(message)
        self.send(message)
        #self.log.info('Enqueued message: %s', message)

    def handle_write(self):
        if not self.outbox:
            return
        message = self.outbox.popleft()
        if len(message) > MAX_MESSAGE_LENGTH:
            raise ValueError('Message too long')
        self.send(message)

    def handle_read(self):
        message = self.recv(MAX_MESSAGE_LENGTH)
        #self.log.info('Received message: %s', message)
        
        
if __name__ == '__main__':
	alice = Client("192.168.0.191", 8080, 'Alice')
	while True:
		print("loop")
		alice.say("Test")
		sleep(1)
