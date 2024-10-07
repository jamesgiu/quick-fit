import '@elastic/eui/dist/eui_theme_dark.css';
import "./index.scss";
import "./index.css";
import "./App.css";

import { EuiLoadingLogo, EuiProvider, EuiEmptyPrompt, EuiLink, EuiFlexGroup, EuiFlexItem, EuiCard, EuiTitle, EuiIcon } from '@elastic/eui';

const MyApp = () => (
  <EuiProvider>
    <div className="app-content">
      <div className="bg-image-wrapper"/>
      <EuiEmptyPrompt
      icon={ <div className="app-logo"/>}
      title={<EuiTitle className="logo-subtext" size='l'><h1>QuickFit</h1></EuiTitle>}
      footer={
        <div className="qf-footer">
          <span>
          © 2024 Jiv
          </span>
          <EuiLink href="#" target="https://github.com/jamesgiu/quick-fit">
             <EuiIcon size="l" type={"logoGithub"}/>
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
