import React from 'react';
import { Link, NavLink, Redirect } from 'react-router-dom'; 

import { Helmet } from 'react-helmet';
import { getConfig } from '@edx/frontend-platform';

import { SwitchErrorInfo } from 'piral-core';

import './style.scss'


const Head = () => (
  <Helmet>
    <title>
      Open edX Piral Prototype
    </title>
    <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
  </Helmet>
);

const OpenEdxLayout = ({ children, Header, Footer}) => (
  <div>
    <Head />
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <Header />
        <div className="d-flex flex-row flex-grow-1">
          <nav style={{ width: '100px' , background: '#BBBBBB'}}>
            <NavLink 
              style={{padding:'2px',border:'1px solid #333333', color:'#333333',display:'block'}} to='/account'>Account</NavLink>
            <NavLink 
              style={{padding:'2px',border:'1px solid #333333', color:'#333333',display:'block'}} to='/learning'>Learning</NavLink>
            <NavLink 
              style={{padding:'2px',border:'1px solid #333333',color:'#333333',display:'block', font:'small'}} to='/learning/course/course-v1:edX+DemoX+Demo_Course/home'>- course</NavLink>
            <div style={{margin: '10px'}}>Alternative Layout Sidebar</div></nav>
          <main className="flex-grow-1">
            {children}
          </main>
        </div>
      <Footer />
    </div>
  </div>

);


export const OpenEdxErrorInfo = (props) => (
  <div>
    <h1>Error</h1>
    <div className="error-container">
      <SwitchErrorInfo {...props} />
    </div>
  </div>
);
const Home = () => (
  <div style={{margin:'1em'}}>
    <p>This is the Shell Home Page for an alternative Layout. Note the 
    sidebar and different content on this page. Both the overall layout
    template and cotent of individual pages can be modified by simply
    using different pilets to define the layout. No changes required to 
    any existing MFEs. Note how the sidebar will persist even when the links
    below are activated.</p>
    <ul>
      <li>Go to <Link to="/account">Account MFE</Link>.</li>
      <li>Go to <Link to="/learning">Learning MFE</Link>.</li>
    </ul>
    <p>Continue exploring layout capabilities:</p>
    <ul>
      <li>Switch back to the <a href="/">Original Layout</a>.</li>
      <li>Switch to an <a href="/?alt=layout,footer">Alternative Footer</a>.</li>
      <li>Switch back to the <a href="/?alt=layout">Original Footer</a>.</li>
    </ul>
    </div>
);


const errors = {
  not_found: () => (
    <div style={{margin:'1em'}}>
    <p className="error">Could not find the requested page. Are you sure it exists?</p>
      <p>
        Go back <Link to="/">Home</Link>.
      </p>
    </div>
  ),
};

export default {
  name: 'openEdx Layout',
  version: '1.0.0',
  spec: 'v2',
  dependencies: {},
  config: {},
  basePath: '/pilets',
  setup(piralApi) {


    piralApi.setLayout( {
      Layout: (({piral, children}) =>
        <OpenEdxLayout
          Header={() => <piral.Extension name='openedx-header'/>}
          Footer={() => <piral.Extension name='openedx-footer.a'/>}>
          {children}
        </OpenEdxLayout>
      ),
      ErrorInfo: (props) =>
      <OpenEdxErrorInfo {...props} />
      },
      errors),

    piralApi.registerPage('/', () => (
      <Home /> 
    ));

    piralApi.registerPage('/dashboard', () => (
      <Home />
    ));

  },
};
