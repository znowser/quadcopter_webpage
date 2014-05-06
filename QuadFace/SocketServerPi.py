import asyncore
import socket
import sys,os
import httplib

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "QuadFace.settings")
#from QuadFace import *

from CommunicationLink.models import QuadCopterData
import sqlite3
from django.core import serializers

from time import sleep

def handle_data(data):
    quad_data = {}
    conn = None;
    try:
        conn = sqlite3.connect('../QuadFace/db.sqlite3')
        c = conn.cursor()
        #print(data)
        for i in range(12):
            start = data.find(":")
            end = data.find("!")
            quad_data[i] = int(data[start+1:end])
            #print(quad_data[i])
            data = data[end+1:]	    
        c.execute("INSERT INTO CommunicationLink_quadcopterdata(BatteryCell1, BatteryCell2, BatteryCell3, Engine1, Engine2, Engine3, Engine4, Temperature, Altitude, Roll, Pitch, Yaw) VALUES (?, ?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,?)", 
        (quad_data[0], quad_data[1], quad_data[2], quad_data[3], quad_data[4], quad_data[5], quad_data[6], quad_data[7], quad_data[8], quad_data[9], quad_data[10], quad_data[11]))
        conn.commit()
        print (serializers.serialize('json', QuadCopterData.objects.all()))
        
            
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
            except sqlite3.Error, e:
                print "Error %s:" % e.args[0]
                sys.exit(1)
            sock, addr = pair
            print 'Incoming connection from %s' % repr(addr)
            handler = EchoHandler(sock)

server = EchoServer('0.0.0.0', 8091)
asyncore.loop()

