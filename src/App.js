import React, { useEffect } from 'react';
import { Theme } from '@twilio-paste/theme';
import { Box } from '@twilio-paste/core/box';
import { SiteRecordings } from './components/SiteRecordings';
import TheatersIcon from '@mui/icons-material/Theaters';
import CallIcon from '@mui/icons-material/Call';
function App() {
  const svgData = 'data:image/png;base64,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';
  const svgStyle = {
    backgroundImage: `url(${svgData})`,
    width: '46px', // Set width and height as needed
    height: '41px',
    backgroundSize: 'cover', // Adjust background size as needed
  };
  const [showResultsRecordings, setShowResultsRecordings] = React.useState(true)
  const [showResultsVideos, setShowResultsVideos] = React.useState(false)

  const showRecordings = () => {
    setShowResultsRecordings(true)
    setShowResultsVideos(false)
  }

  const showVideos = () => {
    setShowResultsRecordings(false)
    setShowResultsVideos(true)
  }

  useEffect(() => {
    localStorage.setItem('recordings', '[{"date":"12/12/2024", "duration":"0:26","time":"15:32:32", "direction":"inbound","phoneNumber":"+6586115961","recordingLocation":"./testcall1.wav"},{"date":"09/09/2019", "time":"01:23:45", "duration":"2:09","direction":"inbound", "phoneNumber":"+6586115962","recordingLocation":"./testcall2.wav"},{"date":"01/04/2024", "time":"17:24:32","duration":"0:35","phoneNumber":"+6586115962", "direction":"outbound","recordingLocation":"./testcall3.wav"}]')
  }, []);

  return (
    <Theme.Provider theme="twilio">
      <div id="body" style={{ margin: "auto", overflow: "hidden" }}>
        <div className="main-header">
          <div className="header-left-section">
            <span className="header-logo">
              <i className="lily-icon lily-icon-logo" style={svgStyle}></i>
            </span>
            <h3 className="header-title" >Verint Call Recording Portal</h3>
          </div>
          <div id="sideNavigationBar" className="navigation" style={{ zIndex: 'var(--zindex-level-0)' }} >

          </div>
        </div>
        <div>
          <Box paddingX="space100" paddingTop="space130" paddingBottom="space200" position="relative" left="50px" top="50px">
          {showResultsRecordings ? <Theme.Provider theme="default">
            <SiteRecordings /></Theme.Provider> : null}
            {showResultsVideos ? <Theme.Provider theme="default">
              <SiteRecordings /></Theme.Provider> : null}
          </Box>
        </div>
      </div>
    </Theme.Provider>
  );
}
export default App;