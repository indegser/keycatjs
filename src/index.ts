class Peekaboo {
  private popup: Window;
  private config;
  private BASE_URI = 'http://localhost:8080';

  constructor(config) {
    this.config = config;
  }

  private open = (pathname) => {
    if (this.popup) {
      this.popup.close();
    }

    return new Promise((res, rej) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (e) => this.respond(e, channel, res, rej);
      this.popup = window.open(this.BASE_URI + pathname, 'peekaboo', 'height=800,width=640');

      window.onmessage = (e) => {
        const { type } = e.data;
        if (type === 'ready') {
          this.popup.postMessage({
            type: 'config',
            payload: this.config,
          }, '*', [channel.port2]);
        }
      }
    });
  }

  private respond = (e: MessageEvent, channel: MessageChannel, res, rej) => {
    const { type, payload } = e.data;
    if (type === 'closed') {
      rej(type);
    } else {
      this.popup && this.popup.close();
      res(payload);
    }
  }

  signin = () => {
    return this.open('/signin');
  }

  transaction = (username, tx) => {
    const pathname = `/transaction?username=${username}&payload=${JSON.stringify(tx)}`;
    return this.open(pathname);
  }
}

export default Peekaboo;
