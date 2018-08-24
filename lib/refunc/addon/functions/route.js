import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { on } from '@ember/object/evented';
import C from 'ui/utils/constants';
import { set, get } from '@ember/object';
import { hash } from 'rsvp';

export default Route.extend({
  refuncStore: service(),
  session:     service(),
  refunc:      service(),

  model() {
    const projectModel = window.l('route:application').modelFor('authenticated.project');
    const clusterId = projectModel.project.clusterId;

    return get(this, 'refunc').isReady(clusterId).then((deployed) => {
      if (!deployed) {
        return { deployed, }
      }

      return get(this, 'refunc').maySwitchClusterOrPoject(projectModel.project).then(
        () => {
          const refuncStore = get(this, 'refuncStore');
          const filter = { 'namespaceId_in': get(this, 'refunc').namespaces };

          return hash({
            funcinst:  refuncStore.findAll('funcinst', { filter }),
            funcdeves: refuncStore.findAll('funcdef', { filter }),
          }).then(
            ({ funcinst, funcdeves }) => EmberObject.create({
              funcinst,
              funcdeves,
              deployed,
            })
          );
        }
      );
    })
  },

  setDefaultRoute: on('activate', function() {
    set(this, `session.${ C.SESSION.CONTAINER_ROUTE }`, 'authenticated.project.refunc.functions');
    set(this, `session.${ C.SESSION.PROJECT_ROUTE }`, undefined);
  }),
});
