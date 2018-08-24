// import { or } from '@ember/object/computed';
// import { get, computed } from '@ember/object';
import Component from '@ember/component';
import layout from './template';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  scope:   service(),
  session:  service(),

  layout,
  model:   null,
  tagName: '',

  actions: {
    toggle() {
      this.sendAction('toggle');
    },
  },

  canExpand: computed('model.instances', function() {
    return this.get('model.instances').length > 0;
  }),

});
