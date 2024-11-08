import { Stack, IStackStyles } from 'office-ui-fabric-react';
import * as React from 'react'
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import SharepointServiceProxy from '../common/sp-proxy/SharepointServiceProxy';
import { ITimesheetProps } from '../ITimesheetProps';
const URL = window.location.href;
const actTab = URL.slice(URL.lastIndexOf("/") + 1);

const Header: React.FunctionComponent<ITimesheetProps> = (props: any) => {
    const [activeMenu, setActiveMenu] = useState<any>(actTab);
    // const _SharepointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props?.context, props?.webURL); 
    const _TimesheetProxy: SharepointServiceProxy = new SharepointServiceProxy(props?.context, props?.webURL);
    const stackStyles: Partial<IStackStyles> = { root: { height: 44 } };
    const [adminLink, setAdminLink] = useState<any>()
    const [managerLink, setManagerLink] = useState<any>()

    useEffect(() => {
        handlepermissions()
    })

    async function handlepermissions() {
        var loggedUser = await _TimesheetProxy.getCurrentUser().then((res: any) => {
            return res
        });
        // var currentuser = loggedUser.User?.Title;

        if (loggedUser.Groups[0]?.Title === "TS_TimeSheetAdmin") {

            setAdminLink(true)
        }
        else {
            setAdminLink(false)
        }

        if (loggedUser.Groups[0]?.Title === "TS_TimeSheetManager") {

            setManagerLink(true)
        }
        else {
            setManagerLink(false)
        }

    }


    return (
        <>
            <nav className="navbar navbar-expand-lg main-head  fixed-top">
                <div className="container-fluid d-flex justify-content-around">
                    <div className="d-flex">
                        <img
                            src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/bluebenz_logo.png'}

                            alt="Logo"
                            width="60"
                            height="50"
                            className="d-inline-block align-text-top logo"
                        />
                    </div>
                    {/* <div>
                        <h3 className="ps-5">TIMESHEET REPORT</h3>
                    </div> */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse ms-5" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className={activeMenu == "Timesheetuser" ? "nav-link btn-active fw-bold border-bottom text-primary" : "nav-link btn-active"} onClick={() => setActiveMenu('Timesheetuser')} href='#/Timesheetuser' aria-current="page">My Time</a>
                            </li>
                            <li className="nav-item">
                                <a className={activeMenu == "report" ? "nav-link btn-active  fw-bold border-bottom text-primary" : "nav-link btn-active"} href={'#/report'} onClick={() => setActiveMenu('report')}>My Monthly Time</a>
                            </li>
                            {/* <li className="nav-item">
                                <a className={adminLink || managerLink ? activeMenu == "ProjectNav" ? "nav-link btn-active  fw-bold border-bottom text-primary" : "nav-link btn-active" : 'd-none'} href={'#/ProjectNav'} onClick={() => setActiveMenu('ProjectNav')}>Projects</a>
                            </li> */}


                            {managerLink || adminLink ?
                                <ul className="navbar-nav  mb-2 mb-lg-0">
                                    <li className="nav-item dropdown">
                                        <a className={activeMenu == "ProjectReport" || activeMenu == "EmployeeReport" || activeMenu === "Projects" ? "nav-link btn-active  fw-bold border-bottom text-primary dropdown-toggle" : "nav-link dropdown-toggle"} href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
                                            aria-expanded="false">
                                            Reports
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li>
                                                <a className={activeMenu === "Projects" ? "nav-link btn-active  fw-bold" : "nav-link btn-active"} href={'#/ProjectNav'} onClick={() => setActiveMenu('Projects')}>Projects</a>
                                            </li>

                                            <li>
                                                <a className={activeMenu === "ProjectReport" ? "nav-link btn-active  fw-bold" : "nav-link btn-active"} href={'#/ProjectReport'} onClick={() => setActiveMenu('ProjectReport')}>Time By Projects</a>
                                            </li>


                                            <li>
                                                <a className={activeMenu === "EmployeeReport" ? "nav-link btn-active  fw-bold" : "nav-link btn-active"} href={'#/EmployeeReport'} onClick={() => setActiveMenu('EmployeeReport')}>Time By Employee</a>
                                            </li>

                                        </ul>
                                    </li>
                                </ul>
                                :
                                null
                            }
                            <Stack horizontal styles={stackStyles}>
                                {/* <CommandBarButton
                                    text="Report"
                                    menuProps={menuProps}
                                    className={activeMenu === "menuProps" ? "btn-active active fw-bold" : "btn-active"}
                                /> */}
                            </Stack>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Header