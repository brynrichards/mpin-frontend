#! /usr/bin/python

import os, glob, sys

if (len(sys.argv)) < 3:
    print "Usage buildMPin.py in-folder dependancy-file [out-file]"
    sys.exit(1)

inFolder = sys.argv[1]
dependancyFile = sys.argv[2]
if len(sys.argv) < 4:
    outFile = None
else:
    outFile = sys.argv[3]



files = [fname for fname in map(lambda x: x.strip(), open(dependancyFile, "r").read().split()) if fname]

buf = ""
for f in files:
    fname = os.path.join(inFolder, f)

    if not os.path.exists(fname):
        print "FILE NOT FOUND!: {0}".format(os.path.abspath(fname))
        sys.exit(1)

    buf = buf + ";\n" + open(fname, "r").read()


if outFile:
    outDir = os.path.dirname(outFile)

    if outDir:
        if not os.path.exists(outDir):
            os.makedirs(os.path.dirname(outFile))
    open(outFile, "w").write(buf)
    print "MPin crypto build done."
else:
    print buf


