
import * as React from 'react'
import { useState } from 'react'
import * as _ from "lodash";
import { ITimesheetProps } from '../ITimesheetProps'
import SharepointServiceProxy from '../common/sp-proxy/SharepointServiceProxy';
// import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertBox from '../common/AlertBox';
import 'ag-grid-community/styles/ag-grid.css';
// import {    GetRowIdFunc,    GetRowIdParams,} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import action from '../common/action';
import * as moment from 'moment';
import Pagination from '../common/Pagination';




const ProjectNav: React.FunctionComponent<ITimesheetProps> = (props: any) => {
    const _SharepointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props?.context, props?.webURL);
    // const _TimesheetProxy: SharepointServiceProxy = new SharepointServiceProxy(props.context, "https://bluebenz0.sharepoint.com/sites/BBDDev")


    const [openModal, setOpenModal] = useState<string>("")
    const [rowData1, setRowData] = useState([]);
    const [paginatedArrEmployee, setPaginatedArrEmployee] = useState<any>()
    // const getRowId = useMemo<GetRowIdFunc>(() => {
    //     return (params: GetRowIdParams) => params.data.id;
    // }, []);
    const navigate = useNavigate();


    React.useEffect(() => {

        getProjectList();
    }, []);

    async function getProjectList() {
        let items = await _SharepointServiceProxy.getItems({
            listName: "Project",
            fields: [
                "ID",
                "ProjectName",
                "StartDate",
                "EndDate",
                "ProjectManager",
                "Status",
                "ActualEfforts",
                "PlannedEfforts",
                "ProjectValue",
                "ClientName/Name",
                "ClientName/ID",
                "Domain/Name",
                "Domain/ID",
                "Technology/Name",
                "Technology/ID",
                "Geography/Name",
                "Geography/ID",
            ],
            expandFields: ["ClientName", "Domain", "Technology", "Geography"],
            isRoot: true,
        });
        setRowData(items);

    }

    // console.log("paginatedArrEmployee" ,paginatedArrEmployee);

    const columnDefs: any = [
        {
            headerName: "ProjectName",
            headerClass: "customcss",
            field: "ProjectName",
            sortable: true,
            filter: true,
            width: 280,
            // pinned: "left",
        },
        {
            headerName: "ProjectManager",
            headerClass: "customcss",
            field: "ProjectManager",
            sortable: true,
            filter: true,
            width: 280,
            // pinned: "left",
        },
        {
            headerName: "StartDate",
            headerClass: "customcss",
            field: "StartDate",
            cellRenderer: (params: any) => {
                return moment(params.value).format('DD/MM/YYYY')
            },
            sortable: true,
            filter: true,
            width: 280,
            cellClass: 'dateISO'
        },
        {
            headerName: "EndDate",
            headerClass: "customcss",
            field: "EndDate",
            cellRenderer: (params: any) => {
                return moment(params.value).format('DD/MM/YYYY')
            },
            sortable: true,
            filter: true,
            width: 280,

        },
        {
            headerName: "Status",
            headerClass: "customcss",
            field: "Status",
            sortable: true,
            filter: true,
            width: 280,

        },
        {
            headerName: "Action",
            headerClass: "customcss",
            field: "Image",
            cellRenderer: action,
            cellRendererParams: { context: props?.context, webURL: props?.webURL },
            // valueGetter: 'node.id',
            width: 280,
            // pinned: "left",
        }
    ];


    const excelStyles: any = [
        {
            id: 'dateISO',
            dataType: 'Date',
            numberFormat: {
                format: 'dd-mm-yyyy'
            }
        }
    ];



    return (
        <>
            {openModal === "updatedSuccessfully" && <AlertBox alertType={'success'} setModal={setOpenModal} message={"messege"} showModal={true} />}
            <div className='body-color pb-5'>
                <div className="container-fluid ">
                    <div className="col-md-12 mt-2">
                        <div className='row mx-0'>
                            <div className="card-body p-2">
                                <div className="d-flex justify-content-between align-items-center">                                    
                                    <div>
                                    <h4 className="mb-0">Admin Timesheet</h4>
                                        <p className="mb-0">
                                            <span
                                                className="text-primary cursor-pointer"
                                                onClick={() => navigate("")}
                                            >
                                                Dashboard
                                            </span>{" "}
                                            /{" "}
                                            <span
                                                className=" cursor-pointer"
                                                onClick={() => navigate("/Timesheetuser")}
                                            >
                                                Projects
                                            </span>{" "}

                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end ">

                        </div>
                    </div>


                    <div className="">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card shadow">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="ag-theme-alpine" style={{ height: 500 }}>
                                                <AgGridReact
                                                    // getRowId={getRowId}
                                                    rowData={paginatedArrEmployee}
                                                    columnDefs={columnDefs}
                                                    excelStyles={excelStyles}
                                                    // pagination={true}
                                                    // paginationAutoPageSize={true}
                                                >
                                                </AgGridReact>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <Pagination
                    orgData={rowData1}
                    setNewFilterarr={setPaginatedArrEmployee}
                />
            </div>
        </>
    )
}

export default ProjectNav