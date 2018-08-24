import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { reference, hasMany } from 'ember-api-store/utils/denormalize';
import Resource from 'ember-api-store/models/resource';

const Funcdef = Resource.extend({
  router:       service(),
  access:       service(),
  store:        service(),
  clusterStore: service(),
  refuncStore:  service(),
  modalService: service('modal'),

  instances: hasMany('id', 'funcinst', 'funcdefId', 'refuncStore'),

  pods: hasMany('id', 'pod', 'id', 'store', function(pod) {
    console.debug(pod, this);
  }, 'refuncStore'),

  type:        'funcdef',
  // canViewYaml: 'true',

  stateMap: {
    running: {
      icon:  'icon icon-tag',
      color: 'text-info',
    },
  },

  namespace: reference('namespaceId', 'namespace', 'clusterStore'),

  init(...args) {
    this._super(...args);
  },

  state: computed('instances.[]', function() {
    const instances = get(this, 'instances');

    if (instances && instances.length > 0) {
      return 'running';
    }

    return 'ready';
  }),

  version: computed('hash', function(){
    const hash = get(this, 'hash');

    if (hash && hash.length > 7) {
      return hash.substring(0, 7);
    }

    return hash;
  }),

  // availableActions: computed('actions.{remove,edit,clone}', function() {
  //   let l = get(this, 'links') || {};

  //   return [
  //     { divider: true },
  //     {
  //       label:    'action.viewConfig',
  //       icon:     'icon icon-files',
  //       action:   'viewConfig',
  //       enabled:  !!l.export,
  //       bulkable: false
  //     },
  //     {
  //       label:    'action.exportConfig',
  //       icon:     'icon icon-download',
  //       action:   'exportConfig',
  //       enabled:  !!l.export,
  //       bulkable: false
  //     }
  //   ];
  // }),

  actions: {
    clone() {
      // get(this, 'router').transitionTo('authenticated.project.pipeline.pipeline', get(this, 'id'), { queryParams: { mode: 'duplicate' } })
    },

    edit() {
      // get(this, 'router').transitionTo('authenticated.project.pipeline.pipeline', get(this, 'id'), { queryParams: { mode: '' } })
    },
  },
});

export default Funcdef;
