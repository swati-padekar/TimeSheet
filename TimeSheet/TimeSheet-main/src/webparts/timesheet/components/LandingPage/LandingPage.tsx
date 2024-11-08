import * as React from 'react'

const LandingPage = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg main-head shadow fixed-top">
                <div className="container-fluid">
                    {/* <h4><span className="text-primary">Resource</span> Allocation</h4>  */}
                    <div className="d-flex">
                        {/* <img src="./Images/Logo.png" alt="Logo" width="45" height="35"
                    className="d-inline-block align-text-top logo" /> */}
                        <h3 className="ps-5 "><span className="text-primary">BBD_</span>Internal Projects</h3>
                    </div>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                        aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse ms-5" id="navbarSupportedContent">

                    </div>
                </div>
            </nav>
            <div className="pt-61 h-100vh maindiv pt-5 ">
                <div className="container pt-5 col-md-12">
                    <div className="row">
                        {/* <div className="col-md-12 pt-3 d-flex"> */}
                        <div className="col-md-4">
                            <div className="card shadow list-hover">
                                <div className="card-body">
                                    {/* <i className="fa-solid fa-business-time timeicon"></i> */}
                                    <img src="../SiteAssets/Image/resource.png" alt="skill icon" style={{width: "50px"}} />
                                    <a href="https://bluebenz0.sharepoint.com/sites/BBD_Internal/ResourceAllocation/SitePages/ResourceAllocation.aspx">
                                        <h5 className='my-4'>Resource Allocation</h5>
                                    </a>
                                </div>
                            </div>
                        </div>


                        <div className="col-md-4">
                            <div className="card shadow list-hover">
                                <div className="card-body">
                                    <i className="fa-solid fa-business-time timeicon"></i>
                                    <a href={"#/Timesheetuser"}><h5 className='my-4'>Time sheet</h5></a>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card shadow list-hover">
                                <div className="card-body">
                                    {/* <i className="fa-solid fa-business-time timeicon"></i> */}
                                    <img src="../SiteAssets/Image/self-development.png" alt="skill icon" style={{width: "50px"}} />
                                    <a href="https://bluebenz0.sharepoint.com/sites/BBD_Internal/Skill_Matrix/SitePages/SkillMatrix.aspx">
                                        <h5 className='my-4'>Skill competency</h5>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* <div className="col-md-3">
                                <div className="card shadow list-hover">
                                    <div className="card-body">
                                    <i className="fa-solid fa-business-time timeicon"></i>
                                    <h5 className='my-4'>Performance</h5>
                                    </div>
                                </div>
                            </div> */}


                        {/* <div className="col-md-3">
                                <div className="card shadow p-3 mb-5 m-2  list-hover">
                                    <div className='my-auto text-center'>
                                        <h5>
                                            <b>Resource Allocation</b>
                                        </h5>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <i className="fa-sharp fa-solid fa-arrow-right"></i>
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-3">
                                <div className="card shadow p-3 mb-5 m-2  list-hover">
                                    <div className='my-auto text-center'>
                                        <h5>
                                            <a href={"#/Timesheetuser"}><b>Time Sheet</b></a>
                                        </h5>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <i className="fa-sharp fa-solid fa-arrow-right"></i>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-3">
                                <div className="card shadow p-3 mb-5 m-2  list-hover">
                                    <div className='my-auto text-center'>
                                        <h5>
                                            <b>Skill Competency</b>
                                        </h5>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <i className="fa-sharp fa-solid fa-arrow-right"></i>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div>


                            <div className="col-md-3">
                                <div className="card shadow p-3 mb-5 m-2  list-hover ">
                                    <div className='my-auto text-center'>
                                        <h5>
                                            <b>Performance</b>
                                        </h5>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <i className="fa-sharp fa-solid fa-arrow-right"></i>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                            </div> */}
                        {/* </div> */}

                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage