
export const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(function (registration) {
          //console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function (err) {
          // registration failed :(
          //console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }