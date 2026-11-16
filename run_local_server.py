"""Local-only server launcher for the teaching prototype (Python standard library)."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import sys
import threading
import webbrowser

ROOT = Path(__file__).resolve().parent
HOST = '127.0.0.1'
PORT = 8765
PROJECT = 'SF Tech Store'


def main():
    try:
        server = ThreadingHTTPServer((HOST, PORT), lambda *args, **kwargs:
            SimpleHTTPRequestHandler(*args, directory=str(ROOT), **kwargs))
    except OSError as exc:
        print(f'\nERROR: {PROJECT} cannot start on http://{HOST}:{PORT}/', flush=True)
        print(f'This port may already be in use. Details: {exc}', flush=True)
        print('Close the existing server using this port, and then run this launcher again.', flush=True)
        return 1
    print(f'\n{PROJECT}', flush=True)
    print(f'Open http://{HOST}:{PORT}/  |  Press Ctrl+C to stop this server.', flush=True)
    print('Closing this terminal also stops the server.', flush=True)
    if os.environ.get('SF_NO_BROWSER') != '1':
        threading.Timer(0.75, lambda: webbrowser.open(f'http://{HOST}:{PORT}/')).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopping server...', flush=True)
    finally:
        server.server_close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
