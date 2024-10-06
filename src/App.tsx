import '@elastic/eui/dist/eui_theme_dark.css';
import "./index.scss";
import "./index.css";
import "./App.css";

import { EuiLoadingLogo, EuiProvider, EuiEmptyPrompt, EuiButton, EuiLink, EuiFlexGroup, EuiCode, EuiFlexItem, EuiPanel, EuiText, EuiTitle, EuiPageHeader } from '@elastic/eui';

const MyApp = () => (
  <EuiProvider>
    <div className="app-content">
      <div className="bg-image-wrapper"/>
      <EuiEmptyPrompt
      icon={<EuiLoadingLogo logo="cloudSunny" size="xl" />}
      title={<h2>Do you need a jacket today, Melbourne?</h2>}
      footer={
        <>
          <EuiLink href="#" target="https://github.com/jamesgiu/quick-fit">
          © 2024 Jiv Pty Ltd jamesgiu/quick-fit
          </EuiLink>
        </>
      }
    />
      <EuiFlexGroup>
  
    <EuiFlexItem>
      <EuiPanel>
       <EuiPageHeader pageTitle="Brunching..." description="Do you need a jacket out and about in Melbourne today?"/>
      </EuiPanel>
    </EuiFlexItem>

    <EuiFlexItem>
      <EuiPanel grow={false}>
      <EuiPageHeader pageTitle="Kick-ons..." description="Will you need a jacket for tonight?"/>
      </EuiPanel>
    </EuiFlexItem>
  </EuiFlexGroup>
    </div>
  </EuiProvider>
);

export default MyApp;
