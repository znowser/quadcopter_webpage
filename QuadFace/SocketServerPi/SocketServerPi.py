import asyncore
import socket
import sys,os

sys.path.append('../../QuadFace')
os.environ['DJANGO_SETTINGS_MODULE'] = '../QuadFace/settings.py'

import sqlite3


from time import sleep

def handle_data(data):
	Angles = {}
	conn = None;
	try:
		conn = sqlite3.connect('../db.sqlite3')
		c = conn.cursor()
		for i in range(3):
			start = data.find(":")
			end = data.find("!")
			Angles[i] = int(data[start+1:end])
			#print(i)
			data = data[end+1:]
				
		c.execute("INSERT INTO CommunicationLink_quadcopterdata(x_angle, y_angle, z_angle) VALUES (?, ?, ?)", (Angles[0], Angles[1], Angles[2]))		
		conn.commit()
		
	except sqlite3.Error, e:
		print "Error %s:" % e.args[0]
		sys.exit(1)	
		
	finally:
		if conn:
			conn.close()


sock = None
class EchoHandler(asyncore.dispatcher_with_send):

    def handle_read(self):
        data = self.recv(1024)
        if data:
        	handle_data(data)
        	#print(data)
            #self.send(data)

class EchoServer(asyncore.dispatcher):

    def __init__(self, host, port):
        asyncore.dispatcher.__init__(self)
        self.create_socket(socket.AF_INET, socket.SOCK_STREAM)
        self.set_reuse_addr()
        self.bind((host, port))
        self.listen(5)

    def handle_accept(self):
        pair = self.accept()
        if pair is not None:
            sock, addr = pair
            print 'Incoming connection from %s' % repr(addr)
            handler = EchoHandler(sock)

server = EchoServer('0.0.0.0', 8080)
asyncore.loop()

