import asyncore
import socket
import sys,os
import httplib,urllib

sys.path.append('../QuadFace')#path to django project
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "QuadFace.settings")#loading quadface settings file, this lets us use Django ORM.

from CommunicationLink.models import QuadCopterData
from django.core import serializers

import sqlite3


from time import sleep

def handle_data(data):
    quad_data = {}
    for i in range(12):
        start = data.find(":")
        end = data.find("!")
        quad_data[i] = int(data[start+1:end])
        data = data[end+1:]	    

    return_str = ""
    for x in quad_data:
        return_str += str(quad_data[x])
        return_str += "/"
    return return_str


sock = None
class EchoHandler(asyncore.dispatcher_with_send):

    def handle_read(self):
        data = self.recv(1024)
        if data:
            dataStr = handle_data(data)
           # print (dataStr)
            conn = httplib.HTTPConnection("localhost", 8080)
            conn.request("GET", "/communication/addData/"+dataStr)
            response = conn.getresponse()
            conn.request("GET", "/communication/updateSockets")
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
            conn = httplib.HTTPConnection("localhost", 8080)
            conn.request("GET", "/communication/clearData")
            response = conn.getresponse()
            conn.close
            sock, addr = pair
            print 'Incoming connection from %s' % repr(addr)
            handler = EchoHandler(sock)

server = EchoServer('0.0.0.0', 8091)
asyncore.loop()

