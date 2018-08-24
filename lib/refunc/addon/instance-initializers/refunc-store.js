import StoreTweaks from 'ui/mixins/store-tweaks';

export function initialize(instance) {
  const cfg = instance.resolveRegistration('config:environment');
  const store = instance.lookup('service:refuncStore');
  const cookies = instance.lookup('service:cookies');

  store.reopen(StoreTweaks);
  store.baseUrl = cfg.refunc.apiEndpoint;

  let timeout = cookies.get('timeout');

  if ( timeout ) {
    store.defaultTimeout = timeout;
  }
  window.rfstore = store;
}

export default {
  name:       'refunc-store',
  initialize
};
