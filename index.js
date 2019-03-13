const PKB_USER_KEY = 'pkb_user'

let popup;

const baseUri = 'http://172.16.100.28:8080';

const promises = [];
const config = {};

const pkb = () => {
  window.addEventListener('message', (e) => {
    if (!e.origin.includes('8080')) return;

    const { data: { id, type, payload } } = e;
    if (type === 'ready') {
      popup.postMessage({
        type: 'config',
        payload: {
          ...config,
          id: performance.now(),
        },
      }, baseUri);
      return;
    }

    if (popup) {
      popup.close();
    }
    const { res, rej } = promises.filter(w => w.id === id)[0];
  
    switch (type) {
      case 'signin': {
        localStorage.setItem(PKB_USER_KEY, payload);
        res(payload);
        break;
      }
      case 'closed': {
        rej(type);
        break;
      }
      default: {
        res(payload);
      };
    }
  })

  const openWindow = (pathname) => {
    return new Promise((res, rej) => {
      const url = new URL(baseUri + pathname);
      // TODO. Open 타입을 유저가 정할 수 있게끔 하자. 팝업이나 새 창.
      popup = window.open(url.href, 'peekaboo', 'height=800,width=640');
      if (popup) {
        popup.focus();
      }
      
      promises.push({
        res,
        rej,
      });
    });
  }

  return {
    getIdentifier: () => {
      return localStorage.getItem(PKB_USER_KEY);
    },
    signin: () => {
      return openWindow('/signin');
    },
    signout: () => {

    },
    useNetwork: (name, nodes) => {
      config.network = {
        name,
        nodes,
      };
    },
    transaction: (tx) => {
      const identifier = localStorage.getItem(PKB_USER_KEY);
      return openWindow(`/transaction?identifier=${identifier}&payload=${JSON.stringify(tx)}`);
    },
  }
};

module.exports = pkb;
