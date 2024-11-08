import * as React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
// import LandingPage from './LandingPage/LandingPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../components/webPartStyle.css'
import "@fortawesome/fontawesome-free/css/all.min.css"
import Timesheetuser from './Timesheet(user)/Timesheetuser';
import Report from './Timesheet(user)/Report';
// import Header from './common/Header';
import ProjectReport from './ProjectAdmin/ProjectReport';
import EmployeeReport from './ProjectAdmin/EmployeeReport';
import ProjectNav from './ProjectAdmin/ProjectNav';
import LandingPage from './LandingPage/LandingPage';
import Header from './common/Header';



const Timesheet = (props:any) => {
  
  return (
    <div className="timesheet-root">
      <HashRouter>
        <Header description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} webURL={props.webURL} context={props.context}/>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/Timesheetuser' element={<Timesheetuser description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''}  webURL={props.webURL} context={props.context}/>} />
          <Route path='/report' element={<Report description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} webURL={props.webURL} context={props.context} />} />

          {/* routing by usharani */}
          <Route path='/ProjectNav' element={<ProjectNav description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} webURL={props.webURL} context={props.context} />} />
          <Route path='/ProjectReport' element={<ProjectReport description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} webURL={props.webURL} context={props.context} />} />
          <Route path='/EmployeeReport' element={<EmployeeReport description={''} isDarkTheme={false} environmentMessage={''} hasTeamsContext={false} userDisplayName={''} webURL={props.webURL} context={props.context} />} />
        </Routes>
      </HashRouter>
      </div>
  )
}

export default Timesheet

