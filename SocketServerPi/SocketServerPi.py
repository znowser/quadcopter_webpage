import asyncore
import socket
import sys,os
import httplib

sys.path.append('../QuadFace')#path to django project
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "QuadFace.settings")#loading quadface settings file, this lets us use Django ORM.

from CommunicationLink.models import QuadCopterData
from django.core import serializers

import sqlite3


from time import sleep

def handle_data(data):
    quad_data = {}
    #conn = None;
    try:
        for i in range(12):
            start = data.find(":")
            end = data.find("!")
            quad_data[i] = int(data[start+1:end])
            #print(quad_data[i])
            data = data[end+1:]	    
        q = QuadCopterData(BatteryCell1=quad_data[0],BatteryCell2=quad_data[1],BatteryCell3=quad_data[2],
        Engine1=quad_data[3], Engine2=quad_data[4], Engine3=quad_data[5], Engine4=quad_data[6], 
        Temperature=float(quad_data[7]), Altitude=float(quad_data[8]), Roll=float(quad_data[9]), Pitch=float(quad_data[10]), Yaw=float(quad_data[11]))
        q.save()
    except sqlite3.Error, e:
        print "Error %s:" % e.args[0]
        sys.exit(1)	
		
    #finally:
        #if conn:
         #   conn.close()


sock = None
class EchoHandler(asyncore.dispatcher_with_send):

    def handle_read(self):
        data = self.recv(1024)
        if data:
            handle_data(data)
            conn = httplib.HTTPConnection("localhost", 8080)
            conn.request("GET", "/communication/updateSockets/")
            response = conn.getresponse()
            conn.close

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
            conn = None
            try:
                conn = sqlite3.connect('../QuadFace/db.sqlite3')
                c = conn.cursor()
                c.execute("DELETE FROM CommunicationLink_quadcopterdata")		
                conn.commit()
                conn.close()  
                #QuadCopterData.objects.all().delete()
            except sqlite3.Error, e:
                print "Error %s:" % e.args[0]
                sys.exit(1)
            sock, addr = pair
            print 'Incoming connection from %s' % repr(addr)
            handler = EchoHandler(sock)

server = EchoServer('0.0.0.0', 8091)
asyncore.loop()

