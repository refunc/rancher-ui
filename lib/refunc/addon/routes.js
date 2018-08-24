import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
  // Define your engine's route map here
  this.route('functions', { path: '/' });
  this.route('funcinst', { path: '/instances/:funcinst_id' });
});
