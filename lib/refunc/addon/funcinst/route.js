import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';
import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  refunc:      service(),
  refuncStore: service(),

  model(params) {
    const projectModel = window.l('route:application').modelFor('authenticated.project');

    return  get(this, 'refunc').maySwitchClusterOrPoject(projectModel.project).then(() => {
      return this.get('refuncStore').find('funcinst', params.funcinst_id).then((funcinst) => {
        return hash({
          pods:    this.get('store').findAll('pod'),
          funcdef: this.get('refuncStore').find('funcdef', funcinst.get('funcdefId')),
        }).then(({ pods, funcdef }) => {
          return EmberObject.create({
            funcinst,
            funcdef,
            pods,
          });
        });
      });
    });
  },

});
