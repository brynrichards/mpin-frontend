#! /usr/bin/python

import sys
if sys.version_info < (2,6):
    sys.stdout.write("This program requires Python 2.6 and later.\n")
    sys.exit(1)

import os, json
import socket

class Console:
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    CLEAR = '\033[0m'

    @staticmethod
    def initConsole():
        # Check for console colors support
        if not sys.stdout.isatty():
            Console.BLUE, Console.GREEN, Console.YELLOW, Console.RED, Console.CLEAR = ["" for _ in range(5)]

    @staticmethod
    def out(rawtext):
        sys.stdout.write(rawtext)
        sys.stdout.flush()


    @staticmethod
    def text(text, newLine=True):
        sys.stdout.write("{0}{1}{2}".format(Console.CLEAR, text, newLine and "\n" or " "))
        sys.stdout.flush()

    @staticmethod
    def info(text, newLine=True):
        sys.stdout.write("{0}{1}{2}{3}".format(Console.GREEN, text, Console.CLEAR, newLine and "\n" or " "))
        sys.stdout.flush()

    @staticmethod
    def blue(text, newLine=True):
        sys.stdout.write("{0}{1}{2}{3}".format(Console.BLUE, text, Console.CLEAR, newLine and "\n" or " "))
        sys.stdout.flush()

    @staticmethod
    def error(text="ERROR", newLine=True):
        sys.stdout.write("{0}{1}{2}{3}".format(Console.RED, text, Console.CLEAR, newLine and "\n" or " "))
        sys.stdout.flush()

    @staticmethod
    def fatal(text, prevLineStrip=False):
        if prevLineStrip:
            Console.error()
        Console.error("*** {0}\n".format(text))
        sys.exit(1)

    @staticmethod
    def done(text="Done", newLine=True):
        sys.stdout.write("{0}{1}{2}".format(Console.CLEAR, text, newLine and "\n" or " "))
        sys.stdout.flush()

    @staticmethod
    def ok(text="Ok", newLine=True):
        Console.done(text)
        sys.stdout.flush()


    @staticmethod
    def getInput(text, validateFunc=None, errorMessage=None):
        while True:
            try:
                r_input = raw_input
            except NameError:
                r_input = input

            try:
                res = r_input("{0}{1}: ".format(Console.CLEAR, text))
            except KeyboardInterrupt:
                Console.fatal("Installation interrupted.")

            if not validateFunc:
                break
            else:
                v = validateFunc(res)
                if v:
                    break
                else:
                    if errorMessage:
                        Console.error(errorMessage)

        return res


def getLocalIPAddress():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("google.com", 80))
        localAddress = s.getsockname()[0]
        s.close()
        return localAddress
    except:
        return False


def updateConfigFile(configFile, key, value): 
    if isinstance(value, basestring):
        configLine = '{0} = "{1}"'.format(key, value)
    else:
        configLine = '{0} = {1}'.format(key, value)

    fContent = open(configFile, "r").read()
    aContent = fContent.split("\n")
    fline = 0
    for i, lc in enumerate(aContent):
        if lc.replace(" ", "").find("{0}=".format(key)) >= 0:
            fline = i
            break
    if fline:
        aContent[fline] = configLine
    else:
        aContent.append(configLine)
    
    try:        
        open(configFile, "w").write("\n".join(aContent))
        return True
    except Exception, E:
        return False




def checkInstallFolder(folder):
    folder = folder.replace("~", os.path.expanduser("~"))
    installFN = os.path.join(folder, "mpin_install.json")

    if not os.path.exists(installFN):
        return False

    try:
        installData = json.loads(open(installFN, "r").read())

        if installData["version"] != "0.3.1":
            Console.error("Unsupported version! Please install M-Pin 0.3.1 and try again!")
            sys.exit(1)

        servicesDir = installData["services_path"]
        demoConfig = os.path.join(servicesDir, "demo", "config.py")

        if not os.path.exists(demoConfig):
            return False
    except:
        return False

    return servicesDir




if __name__ == "__main__":
    currentDir = os.path.dirname(os.path.abspath(__file__))

    Console.initConsole()
    
    Console.text("This program will update your M-Pin configuration files to use the PinPad and Mobile app from this repository.\n")
    i = Console.getInput("Please enter you M-Pin installation folder", checkInstallFolder, "Cannot find M-Pin installation in this location!")
    servicesDir = checkInstallFolder(i)
    demoConfig = os.path.join(servicesDir, "demo", "config.py")
    demofolder = os.path.dirname(demoConfig)
    rpsConfig = os.path.join(servicesDir, "rps", "config.py")
    mpinConfig = os.path.join(servicesDir, "mpin", "config.py")

    Console.text("Patching the demosite config at {0}...".format(demoConfig), newLine=False)

    mpinJSLocation = os.path.join(currentDir, "out", "browser")
    mobileLocation = os.path.join(currentDir, "out", "mobile")
    pinpadDestFolder = os.path.join(demofolder, "public", "mpin")

    if os.path.exists(pinpadDestFolder):
        if os.path.islink(pinpadDestFolder):
            os.remove(pinpadDestFolder)
        else:
            Console.error("FAIL")
            Console.error("{0} exists! Please delete it and try again.".format(pinpadDestFolder))
            sys.exit(1)

    try:
        os.symlink(mpinJSLocation, pinpadDestFolder)
    except:
        Console.error("FAIL")
        Console.error("Cannot create symlink! Source: {0}, Dest: {1}".format(mpinJSLocation, pinpadDestFolder))
        sys.exit(1)

    Console.info("Done")

    updateConfigFile(demoConfig, "mpinJSURL", "/public/mpin/mpin.js")
    updateConfigFile(demoConfig, "mobileAppPath", mobileLocation)
    updateConfigFile(demoConfig, "logLevel", "DEBUG")
    updateConfigFile(demoConfig, "forceActivate", True)

    Console.text("Detecting local IP address...", newLine=False)
    localAddress = getLocalIPAddress()
    if not localAddress:
        Console.error("FAIL")
        Console.error("Network configuration is not set! You can still use it on localhost.")
    else:
        Console.info(localAddress)

        updateConfigFile(mpinConfig, "address", "0.0.0.0")
        updateConfigFile(rpsConfig, "address", "0.0.0.0")
        updateConfigFile(rpsConfig, "MPinAuthenticationServer", "ws://{0}:8002".format(localAddress))
        updateConfigFile(rpsConfig, "rpsBaseURL", "http://{0}:8011".format(localAddress))
        updateConfigFile(demoConfig, "address", "0.0.0.0")
        updateConfigFile(demoConfig, "verifyIdentityURL", "http://{0}:8005/mpinActivate".format(localAddress))
        updateConfigFile(demoConfig, "clientSettingsURL", "http://{0}:8011/rps/clientSettings".format(localAddress))
        updateConfigFile(demoConfig, "RPSURL", "http://{0}:8011".format(localAddress))
        updateConfigFile(demoConfig, "mobileAppFullURL", "http://{0}:8005/m".format(localAddress))
    



    Console.done()

