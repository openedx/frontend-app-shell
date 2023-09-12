const fs = require('fs');
const path = require('path');

const pilets = {
  footer: {
    source : '../frontend-component-footer/dist',
    target: '/assets/pilets/frontend-component-footer/v1.0.0',
    spec  : {
      name: 'openEdx Footer',
      version: '1.0.0',
      spec: 'v2',
      dependencies: {},
      config: {},
      custom: {},
      requireRef: 'webpackChunkpr_edxfrontendcomponentfooter',
      link: '/assets/pilets/frontend-component-footer/v1.0.0/index.js'
    }
  },
  header: {
    source : '../frontend-component-header/dist',
    target: '/assets/pilets/frontend-component-header/v1.0.0',
    spec  : {
      name: 'openEdx Header',
      version: '1.0.0',
      spec: 'v2',
      dependencies: {},
      config: {},
      custom: {},
      requireRef: 'webpackChunkpr_frontendcomponentheader',
      link: '/assets/pilets/frontend-component-header/v1.0.0/index.js'
    }
  },
  account: {
    source : '../frontend-app-account/dist',
    target: '/assets/pilets/frontend-app-account/v1.0.0',
    spec  : {
      name: 'openEdx Account MFE',
      version: '1.0.0',
      spec: 'v2',
      dependencies: {},
      config: {},
      custom: {},
      requireRef: 'webpackChunkpr_frontendappaccount',
      link: '/assets/pilets/frontend-app-account/v1.0.0/index.js'
    }
  },
  learning: {
    source : '../frontend-app-learning/dist',
    target: '/assets/pilets/frontend-app-learning/v1.0.0',
    spec  : {
      name: 'openEdx Learning MFE',
      version: '1.0.0',
      spec: 'v2',
      dependencies: {},
      config: {},
      custom: {},
      requireRef: 'webpackChunkpr_frontendapplearning',
      link: '/assets/pilets/frontend-app-learning/v1.0.0/index.js'
    }
  }
  
}

const piletFeed = {
  items: [pilets.footer.spec, pilets.header.spec, pilets.account.spec, pilets.learning.spec]
}

const targets = {

}

const headers = {
  'content-type': 'application/json',
};

function getFile(pilet, req, res) {
  //match last part of url, split out of request vars
  let file = req.url.match(/\/[^\/]+$/)[0].split('?')[0] || "index.js"
  file = path.resolve(process.cwd(), pilet.source + file);

  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(process.cwd(), file), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        reject(res({
          headers,
          content: err,
        }));
      }
      resolve(res({
        headers,
        content: data,
      }));
    });
  });

}

module.exports = function(_, req, res) {
  try {
    if (req.url === '/api/v1/feed/lms') { 
      return res({
        headers,
        content: JSON.stringify(piletFeed),
      });

    } else {
      const keys = Object.keys(pilets);
      var filePromise; 
      for (var i=0; i<keys.length; i++) {
        const key = keys[i];
        const pilet = pilets[key];
        if (req.url.includes(pilet.target)) {
          filePromise = getFile(pilet, req, res);
          break;
        }
      }
    }
    return filePromise;
    
  } catch (e) {
    console.log(e);
  }
};
