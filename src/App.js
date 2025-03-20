import React, { useEffect } from 'react';
import { Theme } from '@twilio-paste/theme';
import { Heading } from '@twilio-paste/heading';
import { Box } from '@twilio-paste/core/box';
import { Card } from '@twilio-paste/core';
import { Stack } from '@twilio-paste/core';
import { SiteDND } from './components/SiteDND';
import { SiteSettings } from './components/SiteSettings';
import { SiteCampaigns } from './components/SiteCampaigns';
import { SiteDisposition } from './components/SiteDisposition';
import { SiteServiceHours } from './components/SiteServiceHours';
import { Paragraph } from '@twilio-paste/core';
import BlockIcon from '@mui/icons-material/Block';
import CampaignIcon from '@mui/icons-material/Campaign';
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


function App() {
  const svgData = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjQ3cHgiIGhlaWdodD0iNDJweCIgdmlld0JveD0iMCAwIDQ3IDQyIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPGcgaWQ9IkNvbm5lY3QtQ29sb3JzLVYxIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iTWV0cmljcy1OYXZpZ2F0aW9uLUNvcHktMjYiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjAwMDAwMCwgLTEwLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iSGVhZGVyLUNvcHktNiI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iUGFnZS0xLUNvcHktMyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoOS4wMDAwMDAsIDEwLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zOS41MDg1OTAyLDEzLjI1NzM0NSBMMzkuNTIyODIzMiwxMy4xNjM4MDI1IEMzOS4wODA2NTE1LDYuNjUzNjIxIDMzLjExNzAyNjMsNS41MjYzODYzOSAzMC40NTA3MTE4LDkuMTIwNjg2ODcgTDMwLjQ1MDcxMTgsOS4xMjE2MzE3NSBDMjkuNzQ0NzU1Miw3LjEzMDc4MjM0IDI4LjY3MzQ4NTEsNS4yOTk2MTY2NCAyNy4yMTg4NzI5LDMuODQ2NDAwNTEgQzI0LjA3MjQzMjEsMC43MDI4MDQ5MDEgMTkuMjg5MTk2NywtMC45NzE1MTE3MjggMTQuMDU1MjQ5OCwxLjIzNTcxMzgxIEM5Ljk3ODkxOTgzLDIuOTU0NDM5NTEgNy4xMjY2Mjc1Miw3Ljc3MTQwNjg4IDcuMTI2NjI3NTIsMTEuOTU1MzA4NyBDNy4xMjY2Mjc1MiwxMi40NDc1ODggNy4xNTYwNDIzNywxMi45MzIzMDg0IDcuMjEyOTc0MzYsMTMuNDA3NTggTDcuMjEyOTc0MzYsMTMuNDA0NzQ1MyBDNC4yMzI1ODUwOCwxNC4xNjQ0MjQgMC44NzU0OTU4NTgsMTYuNDI1NTA3MyAwLjg3NTQ5NTg1OCwyMS41MzM0OTU5IEMwLjg3NTQ5NTg1OCwyMS42MjMyNTg5IDAuODc2NDQ0NzI1LDIxLjcxMzAyMTkgMC44NzgzNDI0NTcsMjEuODAwODk1MiBDMC45ODY1MTMyMjQsMjYuMjYzNTM0OCA0Ljg0MTc1NzI5LDI5Ljk0NTcwODYgOS4zMjQyMDIwMywyOS45NTA0MzMgTDE4LjU2NjE2MDUsMjkuOTUwNDMzIEwxOC41NjYxNjA1LDQxLjE5OTE1NzMgTDMwLjcwMjE2MTQsMjkuOTUwNDMzIEwzOC40NjEwNDE3LDI5Ljk1MDQzMyBDMzkuNDUwNzA5MywyOS45NTEzNzc4IDQwLjQzNTYzMjYsMjkuNzk2NDE4NSA0MS4zNzIxNjM3LDI5LjQ3Nzk5NiBDNDMuNjUzMjM4NSwyOC43MDIyNTQ1IDQ2Ljk5OTg5MDIsMjYuNjk2Mjg3MSA0Ni45OTk4OTAyLDIxLjYwNDM2MTQgQzQ2Ljk5OTg5MDIsMTUuNjI4MDMzNyA0Mi4yMjA0NTAzLDEzLjcyMTI3ODEgMzkuNTA4NTkwMiwxMy4yNTczNDUgWiIgaWQ9IlN0cm9rZS0zIiBmaWxsPSIjMDBBQkJBIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTE4LjY0MTIxNTgsMTUuNTIxMDc0IEwxMy42NDQ0ODU1LDE5LjA0MDcyOTQiIGlkPSJTdHJva2UtMTEiIHN0cm9rZT0iIzI2MzAzQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMjQuNDQ2MDAwNywyMS42MjA1MTg4IEwyMS42MDAzNTA1LDE2LjIzMDAxMjkiIGlkPSJTdHJva2UtMTMiIHN0cm9rZT0iIzI2MzAzQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzIuMzk5OTY4LDE4LjgwOTcwNzggTDI3LjQwNDE4NjUsMjIuMzI4NDE4MyIgaWQ9IlN0cm9rZS0xNSIgc3Ryb2tlPSIjMjYzMDNCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0zNC44MjM1NjI1LDE1LjI0NDMyMDQgQzMzLjU4MjQ0NTMsMTQuOTQ3NjMgMzIuMzMzNzM3MSwxNS43MDkxOTg0IDMyLjAzNTc5MzEsMTYuOTQ1MDkzNSBDMzEuNzM3ODQ5LDE4LjE4MTkzMzUgMzIuNTAyNjM1MywxOS40MjQ0NDI3IDMzLjc0NDcwMTQsMTkuNzIxMTMzMiBDMzQuOTg1ODE4NiwyMC4wMTc4MjM2IDM2LjIzMzU3NzksMTkuMjU2MjU1MiAzNi41MzE1MjIsMTguMDIwMzYwMSBDMzYuODI5NDY2LDE2Ljc4MzUyMDEgMzYuMDY0Njc5NywxNS41NDEwMTA4IDM0LjgyMzU2MjUsMTUuMjQ0MzIwNCBaIiBpZD0iU3Ryb2tlLTE3IiBzdHJva2U9IiMyNjMwM0IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTI2LjA1OTkyNzYsMjEuNDE3MDg3NCBDMjQuODE4ODEwMywyMS4xMjAzOTcgMjMuNTcwMTAyMiwyMS44ODE5NjU0IDIzLjI3MjE1ODIsMjMuMTE3ODYwNSBDMjIuOTc0MjE0MSwyNC4zNTQ3MDA1IDIzLjczOTAwMDQsMjUuNTk3MjA5NyAyNC45ODEwNjY1LDI1Ljg5MzkwMDIgQzI2LjIyMjE4MzcsMjYuMTkwNTkwNiAyNy40Njk5NDMsMjUuNDI5MDIyMiAyNy43Njc4ODcsMjQuMTkzMTI3MSBDMjguMDY1ODMxMSwyMi45NTYyODcxIDI3LjMwMTA0NDgsMjEuNzEzNzc3OCAyNi4wNTk5Mjc2LDIxLjQxNzA4NzQgWiIgaWQ9IlN0cm9rZS0xOSIgc3Ryb2tlPSIjMjYzMDNCIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0yMS4wNjQ4MTAzLDExLjk1NTY4NjcgQzE5LjgyMzY5MzEsMTEuNjU4OTk2MiAxOC41NzQ5ODUsMTIuNDIwNTY0NiAxOC4yNzcwNDA5LDEzLjY1NjQ1OTggQzE3Ljk3OTA5NjksMTQuODkzMjk5NyAxOC43NDM4ODMyLDE2LjEzNTgwOSAxOS45ODU5NDkyLDE2LjQzMjQ5OTQgQzIxLjIyNzA2NjUsMTYuNzI5MTg5OCAyMi40NzQ4MjU3LDE1Ljk2NzYyMTQgMjIuNzcyNzY5OCwxNC43MzE3MjYzIEMyMy4wNzA3MTM4LDEzLjQ5NDg4NjMgMjIuMzA1OTI3NSwxMi4yNTIzNzcxIDIxLjA2NDgxMDMsMTEuOTU1Njg2NyBaIiBpZD0iU3Ryb2tlLTIxIiBzdHJva2U9IiMyNjMwM0IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTEyLjMwMTA4MDUsMTguMTI4NDUzNiBDMTEuMDU5OTYzMywxNy44MzE3NjMyIDkuODExMjU1MTQsMTguNTkzMzMxNiA5LjUxMzMxMTEsMTkuODI5MjI2NyBDOS4yMTUzNjcwNiwyMS4wNjYwNjY3IDkuOTgwMTUzMzYsMjIuMzA4NTc2IDExLjIyMjIxOTQsMjIuNjA1MjY2NCBDMTIuNDYzMzM2NywyMi45MDE5NTY4IDEzLjcxMTA5NTksMjIuMTQwMzg4NCAxNC4wMDkwNCwyMC45MDQ0OTMzIEMxNC4zMDY5ODQsMTkuNjY3NjUzMyAxMy41NDIxOTc3LDE4LjQyNTE0NDEgMTIuMzAxMDgwNSwxOC4xMjg0NTM2IFoiIGlkPSJTdHJva2UtMjMiIHN0cm9rZT0iIzI2MzAzQiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+';
  const svgStyle = {
    backgroundImage: `url(${svgData})`,
    width: '46px', // Set width and height as needed
    height: '41px',
    backgroundSize: 'cover', // Adjust background size as needed
  };
  const campaign = true;
  const settings = true;
  const dnd = true;
  const dispositions = true;
  const hours = true;

  const [showHeader, setShowHeader] = React.useState(true)
  const [showResultsSettings, setShowResultsSettings] = React.useState(false)
  const [showResultsCampaigns, setShowResultsCampaigns] = React.useState(false)
  const [showResultsDND, setShowResultsDND] = React.useState(false)
  const [showResultsDisposition, setShowResultsDisposition] = React.useState(false)
  const [showResultsServiceHour, setShowResultsServiceHour] = React.useState(false)



  const showSettings = () => {
    setShowHeader(false)
    setShowResultsSettings(true)
    setShowResultsCampaigns(false)
    setShowResultsDND(false)
    setShowResultsDisposition(false)
    setShowResultsServiceHour(false)
  }

  const showCampaign = () => {
    setShowHeader(false)
    setShowResultsSettings(false)
    setShowResultsCampaigns(true)
    setShowResultsDND(false)
    setShowResultsDisposition(false)
    setShowResultsServiceHour(false)
  }

  const showDND = () => {
    setShowHeader(false)
    setShowResultsSettings(false)
    setShowResultsCampaigns(false)
    setShowResultsDND(true)
    setShowResultsDisposition(false)
    setShowResultsServiceHour(false)
  }

  const showHours = () => {
    setShowHeader(false)
    setShowResultsSettings(false)
    setShowResultsCampaigns(false)
    setShowResultsDND(false)
    setShowResultsDisposition(false)
    setShowResultsServiceHour(true)
  }

  const showDispositions = () => {
    setShowHeader(false)
    setShowResultsSettings(false)
    setShowResultsCampaigns(false)
    setShowResultsDND(false)
    setShowResultsDisposition(true)
    setShowResultsServiceHour(false)
  }

  const resetModal = () => {
    setShowHeader(true)
    setShowResultsSettings(false)
    setShowResultsCampaigns(false)
    setShowResultsDND(false)
    setShowResultsDisposition(false)
    setShowResultsServiceHour(false)
  }

  useEffect(() => {
  }, []);

  return (
    <Theme.Provider theme="twilio">
      <div id="body" style={{ margin: "auto", overflow: "hidden" }}>
        <div className="main-header">
          <div className="header-left-section">
            <span className="header-logo">
              <i className="lily-icon lily-icon-logo" style={svgStyle} onClick={() => resetModal()}></i>
            </span>
            <h3 className="header-title" >Amazon Connect Outbound Settings Manager</h3>
          </div>
          <div id="sideNavigationBar" className="navigation" style={{ zIndex: 'var(--zindex-level-0)' }} >
            <ul>
              <li className="lily-side-nav-li">
                <div className="group-drop-down">
                  <button className="page-group-category-button" aria-label="Home">
                    <a onClick={() => showHours()}>
                      <AccessTimeIcon style={{ color: 'white' }} onClick={() => showHours()} />
                    </a>
                  </button>
                  <ul className="group-content">
                    <a onClick={() => showHours()}>
                      <li className="clickable-group">Campaign Schedules</li></a>
                  </ul>
                </div>
              </li>
              <li className="lily-side-nav-li">
                <div className="group-drop-down">
                  <button className="page-group-category-button" aria-label="campaign">
                    <SettingsSuggestIcon style={{ color: 'white' }} onClick={() => showSettings()} />
                  </button>
                  <ul className="group-content">
                    <a onClick={() => showSettings()}>
                      <li className="clickable-group">Campaign Settings</li></a>
                  </ul>
                </div>
              </li>
              <li className="lily-side-nav-li">
                <div className="group-drop-down">
                  <button className="page-group-category-button" aria-label="campaign">
                    <CampaignIcon style={{ color: 'white' }} onClick={() => showCampaign()} />
                  </button>
                  <ul className="group-content">
                    <a onClick={() => showCampaign()}>
                      <li className="clickable-group">Campaign Contacts</li></a>
                  </ul>
                </div>
              </li>
              <li className="lily-side-nav-li">
                <div className="group-drop-down">
                  <button className="page-group-category-button" aria-label="dnd">
                    <BlockIcon style={{ color: 'white' }} onClick={() => showDND()} />
                  </button>
                  <ul className="group-content">
                    <a onClick={() => showDND()}>
                      <li className="clickable-group">Do Not Call Lists</li></a>
                  </ul>
                </div>
              </li>
              <li className="lily-side-nav-li">
                <div className="group-drop-down">
                  <button className="page-group-category-button" aria-label="dispositions">
                    <DeviceUnknownIcon style={{ color: 'white' }} onClick={() => showDispositions()} />
                  </button>
                  <ul className="group-content">
                    <a onClick={() => showDispositions()}>
                      <li className="clickable-group">Disposition Codes</li></a>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div>
          <Box paddingX="space100" paddingTop="space130" paddingBottom="space200" position="relative" left="50px" top="50px">
            {showHeader ? <Theme.Provider theme="default">
              <Heading>Home</Heading>
              <Box variant="borderless">
                <Box style={{ width: '96%', alignContent: 'center' }}>
                  {hours ? <Card style>
                    <Stack orientation="horizontal" spacing="space160">
                      <Box>
                        <AccessTimeIcon style={{ color: '#607794', fontSize: 60 }} onClick={() => showHours()}></AccessTimeIcon>
                      </Box>
                      <Stack orientation="vertical" spacing="space10">
                        <Box>
                          <Heading as="h2" variant="heading40">
                            Campaign Schedule Management
                          </Heading>
                        </Box>
                        <Box>
                          <Paragraph>
                            Customise and manage multiple campaign schedules.
                          </Paragraph>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card> : null}
                  <br></br>
                  {settings ? <Card style>
                    <Stack orientation="horizontal" spacing="space160">
                      <Box>
                        <SettingsSuggestIcon style={{ color: '#607794', fontSize: 60 }} onClick={() => showSettings()}></SettingsSuggestIcon>
                      </Box>
                      <Stack orientation="vertical" spacing="space10">
                        <Box>
                          <Heading as="h2" variant="heading40">
                            Campaign Settings
                          </Heading>
                        </Box>
                        <Box>
                          <Paragraph>
                            List and configure individual campaign settings. Set Schedules, CLID, Retry Interval, Maximum Call Tries etc.
                          </Paragraph>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card> : null}
                </Box>
                <Box style={{ width: '96%', alignContent: 'center' }}>
                  <br />
                  {campaign ? <Card style>
                    <Stack orientation="horizontal" spacing="space160">
                      <Box>
                        <CampaignIcon style={{ color: '#607794', fontSize: 60 }} onClick={() => showCampaign()}></CampaignIcon>
                      </Box>
                      <Stack orientation="vertical" spacing="space10">
                        <Box>
                          <Heading as="h2" variant="heading40">
                            Campaign Contacts
                          </Heading>
                        </Box>
                        <Box>
                          <Paragraph>
                            View Contact lists and Status with Import Functionality
                          </Paragraph>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card> : null}
                  <br></br>
                  {dnd ? <Card style>
                    <Stack orientation="horizontal" spacing="space160">
                      <Box>
                        <BlockIcon style={{ color: '#607794', fontSize: 60 }} onClick={() => showDND()}></BlockIcon>
                      </Box>
                      <Stack orientation="vertical" spacing="space10">
                        <Box>
                          <Heading as="h2" variant="heading40">
                            Do Not Call Lists
                          </Heading>
                        </Box>
                        <Box>
                          <Paragraph>
                            Manage global and campaign specific do not call lists.
                          </Paragraph>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card> : null}

                  <br></br>
                  {dispositions ? <Card style>
                    <Stack orientation="horizontal" spacing="space160">
                      <Box>
                        <DeviceUnknownIcon style={{ color: '#607794', fontSize: 60 }} onClick={() => showDispositions()}></DeviceUnknownIcon>
                      </Box>
                      <Stack orientation="vertical" spacing="space10">
                        <Box>
                          <Heading as="h2" variant="heading40">
                            Disposition Codes
                          </Heading>
                        </Box>
                        <Box>
                          <Paragraph>
                            Manage disposition codes for call outcomes.
                          </Paragraph>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card> : null}
                </Box>
              </Box>
            </Theme.Provider> : null}
            {showResultsDND ? <Theme.Provider theme="default">
              <SiteDND /></Theme.Provider> : null}
            {showResultsSettings ? <Theme.Provider theme="default">
              <SiteSettings /></Theme.Provider> : null}
            {showResultsCampaigns ? <Theme.Provider theme="default">
              <SiteCampaigns /></Theme.Provider> : null}
            {showResultsDisposition ? <Theme.Provider theme="default">
              <SiteDisposition /></Theme.Provider> : null}
            {showResultsServiceHour ? <Theme.Provider theme="default">
              <SiteServiceHours /></Theme.Provider> : null}
          </Box>
        </div>
      </div>
    </Theme.Provider>
  );
}
export default App;