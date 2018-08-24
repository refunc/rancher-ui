import { alias } from '@ember/object/computed';
import { get, set, computed, observer } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router:      service(),

  queryParams: ['sortBy'],

  projectController: null,

  searchText:  '',
  sortBy:      'namespace',

  headers:    [
    {
      name:        'expand',
      sort:        false,
      searchField: null,
      width:       30
    },
    {
      name:           'state',
      sort:           ['sortState', 'namespace.displayName', 'name', 'id'],
      type:           'string',
      searchField:    'displayState',
      translationKey: 'generic.state',
      width:          125,
    },
    {
      name:           'name',
      sort:           ['name', 'id'],
      translationKey: 'generic.name',
    },
    {
      name:           'namespace',
      translationKey: 'generic.namespace',
      searchField:    'namespace.displayName',
      sort:           ['namespace.displayName', 'sortState', 'name', 'id'],
    },
    {
      name:           'version',
      translationKey: 'refuncPage.table.hash',
      searchField:    'hash',
      sort:           ['firstKey', 'name', 'id'],
    },
    {
      name:           'created',
      translationKey: 'generic.created',
      sort:           ['created:desc', 'name', 'id'],
      searchField:    false,
      type:           'string',
      width:          150,
    },
  ],

  group:             alias('projectController.group'),
  groupTableBy:      alias('projectController.groupTableBy'),
  expandedInstances: alias('projectController.expandedInstances'),

  init() {
    this._super(...arguments);
    this.set('projectController', window.lc('authenticated.project'));
  },

  actions: {
    toggleExpand() {
      this.get('projectController').send('toggleExpand', ...arguments);
    },
  },

  groupChanged: observer('group', function() {
    let key = `prefs.refunc-functions-view`;
    let cur = get(get(this, 'projectController'), key);
    let neu = this.get('group');

    if ( cur !== neu ) {
      set(get(this, 'projectController'), key, neu);
    }
  }),

  rows: computed('group', 'model.funcdeves.@each.instances', 'model.funcinsts.[]', function() {
    const groupBy = this.get('group');
    let out = [];

    switch (groupBy) {
    case 'none':
    case 'node':
      out = get(this, 'model.funcdeves');
      break;
    default:
      out = get(this, 'model.funcdeves').filter((fnd) => fnd.get('instances').length > 0);
      break
    }

    return out;
  }),

  linkToDeploy: function(){
    return 'https://refunc.io'
  }.property(),
});
