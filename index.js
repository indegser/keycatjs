const PKB_USER_KEY = 'pkb_user'

let popup;

const baseUri = 'http://localhost:8080';

const promises = [];

const pkb = () => {
  window.addEventListener('message', (e) => {
    if (!e.origin.includes('8080')) return;
    if (popup) {
      popup.close();
    }

    const { data: { id, type, payload } } = e;
    switch (type) {
      case 'signin':
        localStorage.setItem(PKB_USER_KEY, payload);
        break;
      default: ;
    }

    for (const work of promises) {
      const { res, rej, id: workId } = work;
      if (workId === id) {
        res(payload);
        // TODO. pop work from promises.
      }
    }
  })

  const openWindow = (pathname) => {
    return new Promise((res, rej) => {
      const id = performance.now().toString().replace('.', '-');
      const url = new URL(baseUri + pathname);
      url.searchParams.append('id', id);
      // TODO. Open 타입을 유저가 정할 수 있게끔 하자. 팝업이나 새 창.
      popup = window.open(url.href, 'peekaboo');
  
      if (popup) {
        popup.focus();
      }
      
      promises.push({
        id,
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
    transaction: (tx) => {
      const identifier = localStorage.getItem(PKB_USER_KEY);
      return openWindow(`/transaction?identifier=${identifier}&payload=${JSON.stringify(tx)}`);
    },
  }
};

module.exports = pkb;
