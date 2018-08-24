import Ember from 'ember';
import EmberObject from '@ember/object';
import Subscribe from 'shared/mixins/subscribe';
// import { inject as service } from '@ember/service';
import { get, set } from '@ember/object';
import { alias } from '@ember/object/computed';
import C from 'ui/utils/constants';
import ENV from '../config/environment';

export default EmberObject.extend(Subscribe, {
  updateProjectStore: false,
  updateGlobalStore:  false,
  updateClusterStore: false,

  refuncStore:  null,

  refunc:       null,
  watchState:   true,
  watchStateOf: alias('scope.pendingCluster'),
  namespaces:   alias('refunc.namespaces'),

  init() {
    this._super(...arguments);
    set(this, 'endpoint', ENV.refunc.subscribeEndpoint);
  },

  // override
  processQueue() {
    let queue = get(this, 'queue');

    if ( !queue.getLength() ) {
      return;
    }

    // let count = 0;
    let event = queue.dequeue();
    let type, forceRemove;

    Ember.beginPropertyChanges();
    while ( event ) {
      if ( !event.data ) {
        event = queue.dequeue();
        continue;
      }

      const nampesaceId = get(event.data, 'namespaceId');

      if (nampesaceId && !get(this, 'namespaces').includes(nampesaceId)) {
        console.debug(`skip ${ event.name } ${ get(event.data, 'id') }`);
        event = queue.dequeue();
        continue;
      }

      type = get(event.data, 'type');
      forceRemove = (event.name === 'resource.remove');

      // console.log(this.label, (forceRemove ? 'Remove' : 'Change'), `${ type }:${ event.data.id }`);

      const refuncStore = get(this, 'refuncStore');

      if ( refuncStore.hasType(type) ) {
        // console.log('  Update refunc store', type, event.data.id);
        updateStore(refuncStore, event.data, forceRemove);
      }

      // count++;

      event = queue.dequeue();
    }
    Ember.endPropertyChanges();
    // console.log(`Processed ${ count } ${ this.label } change events`);

    function updateStore(store, data, forceRemove = false) {
      // Update the state to removed before we remove it from store
      if ( forceRemove ) {
        data.state = 'removed';
      }
      // Typeify adds or updates the store entry
      const resource = store._typeify(data);

      if ( resource ) {
        // Remove from store if the resource is removed
        if ( forceRemove ||  C.REMOVEDISH_STATES.includes(resource.state) ) {
          const type = get(resource, 'type');

          store._remove(type, resource);
        }
      }
    }
  },

  validate() {
    const socket = get(this, 'subscribeSocket');
    const metadata = socket.getMetadata();
    const socketClusterId = get(metadata, 'clusterId');
    const currentClusterId = get(this, 'scope.currentCluster.id');

    if ( !currentClusterId || currentClusterId === socketClusterId ) {
      return true;
    } else {
      console.error(`${ this.label } Subscribe ignoring message, current=${ currentClusterId } socket=${ socketClusterId } ${  this.forStr() }`);

      return false;
    }
  }
});
