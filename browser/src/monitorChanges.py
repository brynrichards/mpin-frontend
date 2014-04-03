#! /usr/bin/python

import os, sys
import datetime
import subprocess

import tornado.ioloop

CHECK_SECONDS = 2
nextCheck = datetime.timedelta(seconds=CHECK_SECONDS)

COMMAND = os.path.join(os.path.dirname(__file__), "buildTemplates.sh")

class Files:

	fileList = ['templates/']
	fileDict = {}

	@staticmethod
	def checkFiles():
		updated = False
		for f in Files.fileList:
			s = os.stat(f).st_mtime
			if not f in Files.fileDict:
				Files.fileDict[f] = s

			if Files.fileDict[f] != s:
				updated = f
				Files.fileDict[f] = s
		
		return updated


def scheduleCheck():
	f = Files.checkFiles()
	if f:
		print "{0} changed! Reloading...".format(f),
		p = subprocess.Popen(COMMAND, cwd=os.path.dirname(COMMAND))
		p.wait()
		print "Done."

	io_loop.add_timeout(nextCheck, scheduleCheck)


if __name__ == "__main__":
	Files.checkFiles()

	io_loop = tornado.ioloop.IOLoop.instance()
	io_loop.add_timeout(nextCheck, scheduleCheck)
	io_loop.start()
