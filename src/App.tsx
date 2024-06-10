import React from 'react';
import '@elastic/eui/dist/eui_theme_dark.css';
import "./index.scss";

import { EuiLoadingLogo, EuiProvider, EuiText, EuiEmptyPrompt, EuiButton, EuiTitle, EuiLink } from '@elastic/eui';


const MyApp = () => (
  <EuiProvider colorMode="dark">
    <EuiEmptyPrompt
    icon={<EuiLoadingLogo logo="cloudSunny" size="xl" />}
    title={<h2>Do you need a jacket today, Melbourne?</h2>}
    body={<p>Find out from a trusted source immediately.</p>}
    actions={
      <EuiButton color="primary" fill>
        Find out
      </EuiButton>
    }
    footer={
      <>
        <EuiTitle size="xxs">
          <h3>Want to learn more?</h3>
        </EuiTitle>
        <EuiLink href="#" target="_blank">
          Read the docs
        </EuiLink>
      </>
    }
  />
  </EuiProvider>
);

export default MyApp;