import Service from '@ember/service';
import fetch from 'ember-api-store/utils/fetch';
import { inject as service } from '@ember/service';
import { set, get } from '@ember/object';
import SubscribeRefunc from 'refunc/utils/subscribe-refunc';

import ENV from '../config/environment';

export default Service.extend({

  app:         service(),
  scope:       service(),
  refuncStore: service(),

  deploy:         false,
  currentCluster: null,
  currentProject: null,
  namespaces:     [],

  subscribeRefunc: null,

  init() {
    this._super(...arguments);

    this.initSubscribe();
  },

  initSubscribe() {
    const r = SubscribeRefunc.create({
      app:          get(this, 'app'),
      growl:        get(this, 'growl'),
      scope:        get(this, 'scope'),
      refuncStore:  get(this, 'refuncStore'),
      refunc:       this,
    });

    r.set('label', 'Refunc');
    set(this, 'subscribeRefunc', r);
  },

  isReady(clusterId) {
    const requestClusterId = clusterId || get(this, 'scope').currentCluster.id;

    const proxyURL = ENV.refunc.apiEndpoint.replace(get(this, 'app.clusterToken'), requestClusterId);

    return fetch(proxyURL, { contentType: 'application/json' }).then(() => {
      console.debug('refunc is enabled');
      set(this, 'deploy', true);

      return true;
    }).catch(() => {
      set(this, 'deploy', false)
      console.warn('refunc is not enabled');

      return false;
    });
  },

  maySwitchClusterOrPoject(project) {
    const projectOld = get(this, 'currentProject');

    const clusterOld = get(this, 'currentCluster');
    const cluster = (project && get(project, 'cluster')) || null;
    const clusterId = (cluster && get(cluster, 'id')) || null;

    let future = Promise.resolve();
    let resetStore = false;

    const refuncStore = get(this, 'refuncStore');

    if ( cluster !== clusterOld ) {
      resetStore = true;

      if ( cluster ) {
        set(refuncStore, 'baseUrl', ENV.refunc.apiEndpoint.replace(get(this, 'app.clusterToken'), clusterId));

        set(this, 'currentCluster', cluster);
        console.debug(`reset to ${ get(refuncStore, 'baseUrl') }`);
      }

      const subscribeRefunc = get(this, 'subscribeRefunc');

      future = subscribeRefunc.disconnect().then(() => {
        subscribeRefunc.connect(true);
      });
    }

    if (project !== projectOld) {
      resetStore = true;
      if (project) {
        const namespaces = project.namespaces.map((ns) => ns.name);

        console.debug('switch to', namespaces);
        set(this, 'currentProject', project);
        set(this, 'namespaces', namespaces);
      }
    }

    if (resetStore) {
      future.then(() => refuncStore.reset());
      console.debug('reset store');
    }

    return future;
  },
});
