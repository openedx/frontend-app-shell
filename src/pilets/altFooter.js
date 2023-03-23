import * as React from 'react';

import { FormattedMessage, injectIntl } from '@edx/frontend-platform/i18n';
const messages = {
  'en': {
    "foot.message": 'Alternative Footer pilet.'
  },
};


const piletSpec = {
  name: 'openEdx Footer A',
  version: '1.0.0',
  spec: 'v2',
  dependencies: {},
  config: {},
  basePath: '/pilets',
  setup(piralApi) {
    piralApi.mergeMessages(messages);
    piralApi.registerExtension('openedx-footer.a',  
      injectIntl(() => (
        <div style={{textAlign:'center',backgroundColor:'grey',border:'5px solid red'}}>
          <p><FormattedMessage id='foot.message' /></p>
        </div>
      ))
    );
  },

};

export default piletSpec;
