#! /usr/bin/python

import os, glob, sys

if (len(sys.argv)) < 3:
    print "Usage buildTemplates in-folder out-file"
    sys.exit(1)

templateFolder = sys.argv[1]
outFile = sys.argv[2]

outJS = '''(function() {
    mpin.template = {};
    {0}
})();'''


def buildTemplate(inFile):
    
    name = os.path.split(inFile)[1].split(".")[0]

    lines = map(lambda x: "'{0}'".format(x), open(inFile, "r").read().split("\n"))
    jsLines = ",\n        ".join(lines)
    return "    mpin.template['{0}'] = [{1}].join('');".format(name, jsLines)


templates = glob.glob("{0}/*.html".format(templateFolder))


out = '''(function() {
    mpin.template = {};
'''

out += "\n\n".join([buildTemplate(x) for x in templates])

out += '\n})();'

dirname = os.path.dirname(outFile)
if not os.path.exists(dirname):
	os.makedirs(dirname, mode=0777)

open(outFile, "w").write(out)