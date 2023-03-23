// React
import * as React from 'react';
import ReactDOM from 'react-dom';

// Piral and Piral API extensions for OpenEdx
import { createInstance, Piral } from 'piral-core';
import { createLayoutApi, createPlatformApi } from './api';

// OpenEdx Frontend-platform
import { subscribe, initialize, APP_READY, APP_INIT_ERROR, } from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';

// Statically defined Pilets for test purposes 
import { pilets as availablePilets } from './pilets';

// Redux
import { applyMiddleware } from 'redux';
import { createStore } from 'redux-dynamic-modules';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { getSagaExtension } from 'redux-dynamic-modules-saga';
import { getThunkExtension } from 'redux-dynamic-modules-thunk';

// Example Page to show how to define Shell routes. This page is defined
// as route in the Piral instance declaration below.  
import { FormattedMessage } from '@edx/frontend-platform/i18n';
const messages = {
  'en': {
    "embed.head": 'Welcome!',
    "embed.content": 'This page demonstrates how to routes can be defined for the piral instance itself.',
  },
};

const Page = () => {
  return (
    <>
      <h1><FormattedMessage id='embed.head' /></h1>
      <p>
        <FormattedMessage id='embed.content' />
      </p>
    </>
  );
};


// Open edX APP_READY handler. 
subscribe(APP_READY, () => {
  /* Configure Redux
   *
   * In exisitng MFEs the Redux store is configured at creation time as the 
   * reducers and sagas are known to the application before hand. In the Piral
   * context, the shell is not aware of what reducers and sagas must be loaded.
   * To support this, this POC uses Redux Dynamic Modules in order to load 
   * reducers and sagas when pilets's are loaded into the shell.
   */
    const loggerMiddleware =  composeWithDevTools(applyMiddleware(createLogger({
      collapsed: true,
    })));
  
    const store =  createStore({
      extensions: [
        getSagaExtension(),
        getThunkExtension(),
      ],
      loggerMiddleware,
    });
  
  /* Create The Piral instance.
   * 
   * We use and empty state instance (except for the route example below) as layout and error components
   * are handled in the LayoutApi plugin (./api/layout.ts). This demonstrates the ability
   * to control the UX Layout and other components of the user interface through pilets to achieve a highly
   * custom look and feel.
   * 
   * The POC uses both statically defined pilets (availablePilets) as well as pilets defined
   * in the mock Kras piletFeed service (./mocks/piletFeed.js). The layout pilets are statically loaded,
   * while the converted OpenEdx MFE's are loaded via the Mock service. The mock service can be extended
   * so that different Pilet configurations can be dynamically defined at build or runtime to satisfy
   * alternative deployment models.
   */
  const instance = createInstance({
    async: true,
    debug: true,

    state: {
      errorComponents: {},
      components: {},
      routes: {
        '/embed': Page,
      },
    },
    plugins: [
      createLayoutApi(),
      createPlatformApi(),
    ],
    requestPilets() {
      return fetch('http://localhost:1234/api/v1/feed/lms')
        .then((res) => res.json())
        .then((res) => res.items);
    },
    availablePilets
  });

  
  /* Render the Piral Instance inside the Open edX AppProvider */ 
  ReactDOM.render(
    <AppProvider store ={store} wrapWithRouter={false}> 
      <Piral instance={instance} />
    </AppProvider>,
    document.querySelector('#root')
  );
});

// Open edX APP_INIT_ERROR handler. 
subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(
    <ErrorPage locale='en-us' message={error.message} />, 
    document.querySelector('#root')
  );
});

// Open edX frontend-initialization. 
initialize({
  /* Messages and Config:
   *
   * Similar to reducers and sagas, MFE specific internationalization messages and 
   * config are not available during shell initialization. The Piral instance uses
   * an API extension to allow these to be merged into the internationalization
   * modules while the MFE is initialized, which is now decoupled from
   * the platform initialization. Frontend-platform has to expose some additional 
   * endpoints for this to work
   */
  messages: messages,
  requireAuthenticatedUser: false,
  hydrateAuthenticatedUser: true,
  handlers: {},
});