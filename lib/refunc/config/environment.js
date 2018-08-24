/*jshint node:true*/
'use strict';

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'refunc',
    environment: environment,
    refunc: {
        apiEndpoint: '/k8s/clusters/%CLUSTERID%/api/v1/namespaces/refunc/services/http:refunc-rancher:80/proxy/refunc/v1',
        subscribeEndpoint: '/k8s/clusters/%CLUSTERID%/api/v1/namespaces/refunc/services/http:refunc-rancher:80/proxy/refunc/v1/subscribe/x-forwarded-uri/api/v1/namespaces/refunc/services/http:refunc-rancher:80/proxy',
    },
  };

  return ENV;
};
