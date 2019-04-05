class Peekaboo {
  private popup: Window;
  private config;
  private BASE_URI = `${location.protocol}//peekaboo.eosdaq.com`;

  constructor(config) {
    this.config = config;
  }

  private open = (pathname) => {
    if (this.popup) {
      this.popup.close();
    }

    return new Promise((res, rej) => {
      this.popup = window.open(this.BASE_URI + pathname, 'peekaboo', 'height=800,width=640');
      const check = () => {
        if (this.popup.closed) {
          rej('closed');
          return;
        }
        requestAnimationFrame(check);
      }

      check();

      window.onmessage = (e) => {
        const { type } = e.data;
        if (type === 'ready') {
          const channel = new MessageChannel();
          channel.port1.onmessage = (e) => this.respond(e, res, rej);
          this.popup.postMessage({
            type: 'config',
            payload: this.config,
          }, '*', [channel.port2]);
        }
      }
    });
  }

  private respond = (e: MessageEvent, res, rej) => {
    const { type, payload } = e.data;
    if (type === 'closed') {
      rej(type);
    } else {
      const { data, error } = payload;
      this.popup && this.popup.close();
      if (error) {
        rej(error);
      } else {
        res(data);
      }
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
