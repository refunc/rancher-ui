import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import Resource from 'ember-api-store/models/resource';
import { reference } from 'ember-api-store/utils/denormalize';

export default Resource.extend({
  store:        service(),
  clusterStore: service(),
  refuncStore:  service(),

  type: 'funcinst',

  namespace: reference('namespaceId', 'namespace', 'clusterStore'),

  funcdef: reference('funcdefId', 'funcdef', 'refuncStore'),

  init(...args) {
    this._super(...args);
  },

  triggerName: computed('labels.[]', function() {
    return get(this, 'labels')['refunc.io/trigger-type'];
  }),

  lastActivity: computed('status.conditions.[]', function() {
    const active = get(this, 'status.conditions').find((c) => c.type === 'Active');

    return active ? active.lastUpdateTime : '';
  })

});
