import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router:      service(),

  funcinst: alias('model.funcinst'),

  pods: computed('model.pods.[]', function() {
    const pods = this.get('model.pods')

    return pods.filter((pod) => `${ pod.namespaceId }:${ pod.labels['refunc.io/name'] }` === this.get('funcinst.id'));
  }),
});
