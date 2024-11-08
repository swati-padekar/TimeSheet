import { Modal } from 'office-ui-fabric-react';
import * as React from 'react'
import { useState } from 'react'
import { ITimesheetProps } from '../ITimesheetProps';
import AlertBox from './AlertBox';
import SharepointServiceProxy from './sp-proxy/SharepointServiceProxy';

const action: React.FunctionComponent<ITimesheetProps> = (props: any) => {
    const _SharepointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props?.context, props?.webURL);
    const [show, setShow] = useState<boolean>(false);
    // const [project, setProject] = useState<any[]>([]);
    // console.log(project)
    const [domainNames, setDomainNames] = useState<any>([])
    const [popupData, setPopupData] = useState<any>()
    const [techNamesData, setTechNames] = useState<any>([])
    const [geographyNames, setGeographyNames] = useState<any>([])
    // const [updateDetails, setUpdateDetails] = useState<any>({})
    const [clientNameList, setClientNameList] = useState<any>([])
    const [openModal, setOpenModal] = useState<string>("")

    const handleClick = (modalData: any) => {
        setPopupData(modalData)
        setShow(true)
    }

    const domainNamesFunc = async () => {
        let items = await _SharepointServiceProxy.getItems({
            listName: "Domain",
            fields: [
                "ID",
                "Name",
            ],
            isRoot: true
        });
        setDomainNames(items);
    }

    const techNames = async () => {
        let items = await _SharepointServiceProxy.getItems({
            listName: "Technology",
            fields: [
                "ID",
                "Name",
            ],
            isRoot: true
        });
        setTechNames(items);
    }
    const GeographyNames = async () => {
        let items = await _SharepointServiceProxy.getItems({
            listName: "Geography",
            fields: [
                "ID",
                "Name",
            ],
            isRoot: true
        });
        setGeographyNames(items);
    }

    const clientList = async () => {
        let items = await _SharepointServiceProxy.getItems({
            listName: "Client",
            fields: [
                "ID",
                "Name",
            ],
            isRoot: true
        });
        setClientNameList(items);
    }

    React.useEffect(() => {
        // getProjectList();
        domainNamesFunc();
        techNames();
        GeographyNames();
        clientList()
    }, []);

    // async function getProjectList() {
    //     let items = await _SharepointServiceProxy.getItems({
    //         listName: "Project",
    //         fields: [
    //             "ID",
    //             "ProjectName",
    //             "StartDate",
    //             "EndDate",
    //             "ProjectManager",
    //             "Status",
    //             "ActualEfforts",
    //             "PlannedEfforts",
    //             "ProjectValue",
    //             "ClientName/Name",
    //             "ClientName/ID",
    //             "Domain/Name",
    //             "Domain/ID",
    //             "Technology/Name",
    //             "Technology/ID",
    //             "Geography/Name",
    //             "Geography/ID",
    //         ],
    //         expandFields: ["ClientName", "Domain", "Technology", "Geography"],
    //         isRoot: true
    //     });
    //     setProject(items);

    // }


    const onChangeFormVal = (e: any, colName: string) => {
        // setUpdateDetails((prev: any) => {
        //     return { ...prev, [colName]: e.target.value }
        // })
    }

    // const getDropDownVal = (e: any, colName: string) => {
    //     switch (colName) {
    //         case "ClientNameid":
    //             let getCLientID = clientNameList?.find((itr: any) => {
    //                 if (itr.Name === e.target.value) {
    //                     return itr.ID
    //                 }
    //             })
    //             setUpdateDetails((prev: any) => {
    //                 return { ...prev, "ClientNameId": getCLientID.ID }
    //             })
    //             break;

    //         case "Domainid":
    //             let getDomainID = domainNames?.find((itr: any) => {
    //                 if (itr.Name === e.target.value) {
    //                     return itr.ID
    //                 }
    //             })
    //             setUpdateDetails((prev: any) => {
    //                 return { ...prev, "DomainId": getDomainID.ID }
    //             })
    //             break;
    //         case "Technologyid":
    //             let getTechnologyID = techNamesData?.find((itr: any) => {
    //                 if (itr.Name === e.target.value) {
    //                     return itr.ID
    //                 }
    //             })
    //             setUpdateDetails((prev: any) => {
    //                 return { ...prev, "TechnologyId": getTechnologyID.ID }
    //             })
    //             break;
    //         case "Geographyid":
    //             let getGeoID = geographyNames?.find((itr: any) => {
    //                 if (itr.Name === e.target.value) {
    //                     return itr.ID
    //                 }
    //             })
    //             setUpdateDetails((prev: any) => {
    //                 return { ...prev, "GeographyId": getGeoID.ID }
    //             })
    //             break;
    //     }
    // }

    // const update = (itemId: number) => {
    //     _SharepointServiceProxy.updateItem('Project', itemId, updateDetails, [], true)
    //         .then(() => {
    //             // getProjectList(),
    //                 setShow(false)
    //                 setOpenModal("updatedSuccessfully")

    //         })
    // }


    return (
        <div>

            <svg
                onClick={() => handleClick(props?.data)}
                xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-eye pointer add-icon" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
            </svg>
            {/* </TooltipHost> */}

            {openModal === 'updatedSuccessfully' && <AlertBox setModal={setOpenModal} message={"Updated Successfully"} showModal={true} alertType={'success'} />}
            <>
                <Modal
                    isOpen={show}
                    onDismiss={() => setShow(false)}
                    isBlocking={true}
                    containerClassName="create-event-modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" >
                             Project Details
                            </h1>
                        </div>
                        <hr />
                        <form >
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Project Name</label>
                                        <input
                                            disabled
                                            defaultValue={popupData?.ProjectName}
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => { onChangeFormVal(e, 'ProjectName') }}
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Project Manager</label>
                                        <input
                                            disabled
                                            defaultValue={popupData?.ProjectManager}
                                            type="text"
                                            className="form-control"
                                            onChange={(e) => { onChangeFormVal(e, 'ProjectManager') }}
                                        />

                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Client</label>
                                        <div className="input-group">
                                            <select defaultValue={popupData?.ClientName?.Name} className="form-select" disabled
                                            // onChange={(e) => getDropDownVal(e, "ClientNameid")}
                                            >
                                                {clientNameList?.map((itr: any) => {
                                                    return (

                                                        <option value={itr?.Name}>
                                                            {itr?.Name}
                                                        </option>
                                                    )
                                                })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Start Date</label>
                                        <input
                                            disabled
                                            defaultValue={popupData?.StartDate?.slice(0, 10)}
                                            type="date"
                                            className="form-control"
                                            onChange={(e) => { onChangeFormVal(e, 'StartDate') }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">End Date</label>
                                        <input
                                            disabled
                                            defaultValue={popupData?.EndDate?.slice(0, 10)}
                                            type="date"
                                            className="form-control"
                                            onChange={(e) => { onChangeFormVal(e, 'EndDate') }}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Status</label>
                                        <div className="input-group mb-3">
                                            {/* <select className="form-select" defaultValue={popupData?.Status}
                                                disabled
                                                onChange={(e) => { onChangeFormVal(e, 'Status') }}>
                                                <option hidden selected>--Select--</option>
                                                <option value="Completed">Completed</option>
                                                <option value="InProgress">InProgress</option>
                                            </select> */}
                                            <input
                                                disabled
                                                defaultValue={popupData?.Status}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>


                                {/* <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Project Value</label
                                        >
                                        <input
                                            disabled
                                            defaultValue={popupData?.ProjectValue}
                                            type="text"
                                            onChange={(e) => { onChangeFormVal(e, 'ProjectValue') }}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <p className="form-label ">Planned Efforts</p>
                                        <input
                                            disabled
                                            defaultValue={popupData?.PlannedEfforts}
                                            type="text"
                                            onChange={(e) => { onChangeFormVal(e, 'PlannedEfforts') }}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Actual Efforts</label>
                                        <input
                                            disabled
                                            defaultValue={popupData?.ActualEfforts}
                                            type="text"
                                            onChange={(e) => { onChangeFormVal(e, 'ActualEfforts') }}
                                            className="form-control"
                                        />
                                    </div>
                                </div> */}
                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Industry</label>
                                        <div className="input-group mb-3">
                                            <select defaultValue={popupData?.Domain?.Name} className="form-select"
                                                disabled
                                            // onChange={(e) => getDropDownVal(e, "Domainid")}
                                            >
                                                {domainNames?.map((itr: any) => {
                                                    return (
                                                        <option value={itr?.Name}>{itr?.Name}</option>
                                                    )
                                                })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label ">Technology</label>
                                        <div className="input-group mb-3">

                                            <select defaultValue={popupData?.Technology?.Name} className="form-select"
                                                disabled
                                            // onChange={(e) => getDropDownVal(e, "Technologyid")}

                                            >
                                                {techNamesData?.map((itr: any) => {
                                                    return (
                                                        <option value={itr?.Name}>
                                                            {itr?.Name}
                                                        </option>
                                                    )
                                                })
                                                }
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label htmlFor="inputEmail4" className="form-label " >Location</label>
                                        <div className="input-group">
                                            <select defaultValue={popupData?.Geography?.Name} className="form-select"
                                                disabled
                                            // onChange={(e) => getDropDownVal(e, "Geographyid")}

                                            >
                                                {
                                                    geographyNames?.map((itr: any) => {
                                                        return (
                                                            <option value={itr?.Name}>{itr?.Name}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <hr />
                            <footer className="d-flex justify-content-end align-items-center">
                                <button type='button' className="btn btn-secondary me-2 btn-size"
                                    onClick={() => setShow(false)}
                                >Back</button>
                                {/* <button type='button' className="btn btn-primary ms-2 btn-size"
                                     onClick={() => { setShow(false), update(parseInt(popupData?.ID)) }}
                                >Update</button> */}
                            </footer>

                        </form>
                    </div>
                </Modal>
            </>

        </div>
    )
}

export default action