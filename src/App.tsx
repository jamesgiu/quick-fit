import '@elastic/eui/dist/eui_theme_dark.css';
import "./index.scss";
import "./index.css";
import "./App.css";

import { EuiLoadingLogo, EuiProvider, EuiEmptyPrompt, EuiLink, EuiFlexGroup, EuiFlexItem, EuiPanel, EuiPageHeader, EuiCard, EuiIcon, EuiLoadingChart } from '@elastic/eui';

const MyApp = () => (
  <EuiProvider>
    <div className="app-content">
      <div className="bg-image-wrapper"/>
      <EuiEmptyPrompt
      icon={   <EuiLoadingChart size="xl" />}
      title={<h2>Do you need a jacket today, Melbourne?</h2>}
      footer={
        <div className="qf-footer">
          <EuiLink href="#" target="https://github.com/jamesgiu/quick-fit">
          © 2024 Jiv Pty Ltd jamesgiu/quick-fit
          </EuiLink>
        </div>
      }
      />
      <EuiFlexGroup>  
        <EuiFlexItem>
          <EuiCard
          className="day-card"
          icon={<EuiLoadingLogo size="xl" logo={"sun"}/>}
          title={"Brunching..."}
          description="Do you need a jacket out and about in Melbourne today?"
          betaBadgeProps={{
            label: 'Brunching...',
            color: 'accent',
          }}
        />
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiCard
          className="night-card"
          icon={<EuiLoadingLogo size="xl" logo={"moon"}/>}
          title={"Kick-ons..."}
          description="Will you need a jacket for tonight?"
          betaBadgeProps={{
            label: 'Kick-ons...',
            color: 'subdued',
          }}
        />
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  </EuiProvider>
);

export default MyApp;
