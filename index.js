let popup;

const PKB_USER_KEY = 'pkb_user'

let popup;

const baseUri = 'http://localhost:8080';

const pkb = () => {
  window.addEventListener('message', (e) => {
    if (!e.origin.includes('8080')) return;
    if (popup) {
      popup.close();
    }

    const { data: { type, payload } } = e;
    switch (type) {
      case 'signin':
        localStorage.setItem(PKB_USER_KEY, payload);
        break;
      case 'tx':
        alert(`success ${payload}`);
        break;
      default:
        return;
    }
  })

  const openWindow = (url) => {
    popup = window.open(baseUri + pathname, 'peekaboo', 'height=800,width=640');
    if (popup) {
      popup.focus();
    }
    return popup;
  }

  return {
    signin: () => {
      openWindow('/signin');
    },
    signout: () => {

    },
    transaction: (tx) => {
      const identifier = localStorage.getItem(PKB_USER_KEY);
      openWindow(`/transaction?identifer=${identifier}&payload=${JSON.stringify(tx)}`);
    },
  }
};

module.exports = pkb;
