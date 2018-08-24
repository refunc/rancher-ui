import { set,  computed, observer } from '@ember/object';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isMore } from 'ui/utils/platform';
import layout from './template';

export default Component.extend({
  router: service(),

  layout,

  tagName: 'div',

  model: null,

  resourceActions: null,
  tooltipService:  null,

  type:             'tooltip-action-menu',
  classNames:       ['vertical-middle'],
  template:         'tooltip-funcinst-dot',

  init() {
    this._super(...arguments);
    set(this, 'resourceActions', window.l('service:resource-actions'));
    set(this, 'tooltipService', window.l('service:tooltip'));
  },

  alt: computed('model.{state,name}', function() {
    return `${ this.get('model.name')  }: ${  this.get('model.state') }`;
  }),

  resourceActionsObserver: observer('resourceActions.open', function() {
    if (this.get('tooltipService.openedViaContextClick')) {
      this.get('tooltipService').set('openedViaContextClick', false);
    }
  }).on('init'),

  click(event) {
    this.details(event);
    this.get('tooltipService').hide();
  },

  details(/* event*/) {
    this.get('router').transitionTo('authenticated.project.refunc.funcinst', this.get('model.id'));
  },

  contextMenu(event) {
    if ( isMore(event) ) {
      return;
    }

    event.preventDefault();

    this.get('resourceActions').set('open', true);
    this.get('tooltipService').set('openedViaContextClick', true);
  },

});
