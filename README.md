# frontend-app-shell

The `frontend-app-shell` repository is a proof of concept for decomposing Open edX Micro Frontends (MFEs) into 'pilets' that can be loaded into a [Piral](https://piral.io) shell service. The context for this proof of concept can be found in [OEP-XXXX](https://github.com/openedx/open-edx-proposals/blob/426f6e09ffe615e77aa9205281d77012385a08d4/oeps/architectural-decisions/oep-XXXX-modular-micro-frontend-domains.rst#id1) and [FC-0007 Modular MFE Domains Discovery](https://openedx.atlassian.net/wiki/spaces/COMM/pages/3614900241/FC-0007+-+Modular+MFE+Domains+Discovery).

## Overview

This proof of concept demonstrates key features of Piral and how the framework can assist Open edX in continuing to promote modular frontend development while maintaining control over the platform architecture to support UI and UX consistency, modern single-page application design, optimized runtime builds, dependency management, and many other features that can greatly simplify MFE development by removing them from the set of concerns each MFE must implement separately. 

The Goal of this POC is to provide a working example of an Open edX frontend deployed as a single page application that federates the account and learning MFE's seamlessly, and to act as a blueprint for future migration of additional MFEs to this paradigm.  

## Running

Node.js version 18.16.1 was used to develop this prototype. Other versions may work but they are untested. Please consider using nvm for easy compatibility. 

### Running:
**Make sure you have Open edX [devstack](https://github.com/openedx/devstack) with lms running before trying this**

To run the project:

1) clone this repository
2) `nvm use` (if using nvm)
3) `npm install`
4) `npm start`
5) Access the running instance at http://localhost:1234/

By default, this will run a piral shell that loads converted MFEs that have been published to the piral.cloud [pilet feed service](https://feed.piral.cloud/api/v1/pilet/openedx-poc). For development purpses, and to add additional pilets/MFEs the environment variable `USE_LOCAL_PILETS` can be set to `true`. This will force the use of local builds of the pilets instead. Instructions for building pilets locally follow:

### Development instructions
In order to make local changes to the MFEs loaded by this project 4 additional projects must to be downloaded -  two forks of current Open edX MFEs that show the conversion process for current MFEs to pilets, and forks of two open edx component libraries for header and footer.  

#### Downstream MFE dependencies
- [Account MFE Fork](https://github.com/hammerlabs-net/frontend-app-account)
- [Learning MFE Fork](https://github.com/hammerlabs-net/frontend-app-learning)
- [Footer Component Fork](https://github.com/hammerlabs-net/frontend-component-footer)
- [Header Component Fork](https://github.com/hammerlabs-net/frontend-component-header)

Clone the MFE repositories to a common parent directory of where you cloned this repository. After cloning:

0. Run `nvm use 18.16.1`
1. Switch all forks to their `oep65` branches.
2. Run `npm install && npm run build` on this project (`frontend-app-shell`)
3. Run the following commands on these projects in this order: `frontend-component-footer`, `frontend-component-header`, `frontend-app-account`, `frontend-app-learning`:

```npm uninstall frontend-app-shell && npm install --save-dev ../frontend-app-shell/dist/emulator/frontend-app-shell-1.0.0.tgz && npm run build``` 

4. Modify the `USE_LOCAL_PILETS` environment variable to `true`
5. Run `npm start` in this project.
6. Access the running instance at http://localhost:1234/

### Key features:

1. The Piral shell was instantiated using the `piral new --tag 1.0.0 --language js --npm-client npm --bundler webpack5 --framework piral-core` CLI command. Note the use of the `piral-core` framework, which is a smaller subset of the larger Piral framework. Piral-core provides the optimal set of features, including the ability to load MFEs at runtime (inherited from `piral-base`) and a React-based component API for registering UI components and routing between them. Piral itself adds additional and opinionated extensions to this API. In particular, Piral mandates a specific React version (piral-core only has a peer dependency). Piral also includes extensions for creating dashboards, menus, modals, notifications, and translations that are all already a part of Open edX Frontend Platform. Read about the differences [here](https://docs.piral.io/guidelines/tutorials/22-core-and-base).
2. The Piral shell is implemented as a [frontend-platform](https://github.com/openedx/frontend-platform) application. `index.jsx` implements the necessary lifecycle methods from the platform, using the `APP_READY` event to instantiate the Piral instance and render it into the page. As this POC demonstrates, these two projects coexist very well, which provides a long runway to examine how they should be coupled (see discussion below about shell vs pilet initialization).
3. The Piral shell by default uses pilets that have been published to [piral.cloud](https://feed.piral.cloud/api/v1/pilet/openedx-poc) Alternatively, it also uses a local proxy to emulate a feed from locally built pilets. More detauls about pilet loading strategy can be found [here](https://docs.piral.io/reference/specifications/feed-api-specification) Architecture discussion is necessary to determine an optimal strategy for pilet loading for Open edX.
4. The forked MFE projects were quick "hacks" to demonstrate how simply an existing MFE can be converted into a pilet, however not much attention was paid to refactoring their build process beyond "It just worked" when using the build targets acquired from the make file for `frontend-component-header`. Noteworthy are the migration of core dependencies into peer dependencies now provided by the shell, the new build target for `npm run` based on the build target of `frontend-component-xxx` projects, and the changes to `index.jsx` and `pilet.jsx`, which change how the MFE is rendered. The next features discuss the important points to note about the important differences between `pilet.jsx` and `index.jsx`.
5. In their current implementation, `frontend-platform` initialization and MFE initialization are tightly coupled. In Piral,that is not the case. The platform is initialized with the Piral Shell. MFEs (now Pilets) are initialized when loaded by Piral. Some consequences of this change:
    * The shell centralized creation of the Redux datastore by utilizing the [Redux Dynamic Modules](https://redux-dynamic-modules.js.org/#/) library. In the MFE projects, note how the changes to convert the projects into pilets removed the code to create the store. The `pilet.jsx` instead uses the `setup()` method in the pilet lifecyle to loads the reducers, sagas, and thunks using `<DynamicModuleLoader/>` provided by Redux Dynamic Modules libraries.
    * Initialization handler overrides for `messages` and `config` have also been moved to the `setup()` method. A new Piral API extension is used to provide endpoints for pilets to merge the messages and config they require
    * Authenticated calls to frontend-platform initialized components are now proxied via the piral-api. 
6. Layout for the Piral shell demonstrates some of the key capabilities of Piral to simplify frontend development, standardize UI and UX, and smooth the transition between MFEs.
    * The shell implements an API extension to allow the layout to be defined by a pilet (see notes [here](https://docs.piral.io/reference/documentation/C01-components)). This allows different pilets to be created to provide different layouts for different deployments of the platform, without requiring any changes to existing MFEs. You can see an example of this in action by using the URL search query: `?alt=layout`. A different pilet configuration with an alternative layout pilet with a sidebar will be loaded.
    * The example pilet responsible for layout uses pilet ["extensions"]([https://docs.piral.io/concepts/core-api/07-extension](https://docs.piral.io/guidelines/tutorials/24-extension-patterns)) to provide UI "slots" for components such as headers and footers and other shared layout. In this POC, both Open edX [frontend-component-header](https://github.com/openedx/frontend-component-header) and [frontend-component-footer](https://github.com/openedx/frontend-component-footer) are loaded as extension pilets to fill slots defined by the layout pilet. Note how the Footer component is wrapped by the components in `./src/pilets/footer`. The Header component is wrapped in the same manner inside the forked component project by `Pilet.jsx`. 
    * Extending both bullets above, we show how different extension pilets can be used to fill an extension slot defined by a layout. The URL search query `?alt=footer` will replace the standard Open edX footer with one displaying a simple message. [NB: the `alt` switches can be combined in the URL `?alt=layout,footer`]
7. Almost forgot ... Single page Nav!! (via the "piral dashboard" navigation and the "alternative layout" sidebar. 
    
