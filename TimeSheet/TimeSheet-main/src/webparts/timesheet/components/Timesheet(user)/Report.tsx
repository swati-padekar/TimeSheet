import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react';
import SharepointServiceProxy from '../common/sp-proxy/SharepointServiceProxy';
import { ITimesheetProps } from '../ITimesheetProps'
import * as moment from "moment";
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { format } from 'date-fns';
import { DirectionalHint, TooltipHost } from 'office-ui-fabric-react';
import Pagination from '../common/Pagination';


const Report: React.FunctionComponent<ITimesheetProps> = (props: any) => {
    // const [userData, setUserData] = useState<any>({});
    // const [prjData, setPrjData] = React.useState<any[]>([])
    const _SharepointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props?.context, props?.webURL);
    const [rowData, setRowData] = useState([]);
    const [paginatedArrEmployee, setPaginatedArrEmployee] = useState<any>()
    const navigate = useNavigate();
    const [currentDay, setCurrentDay] = useState<number>()
    const gridRef = useRef<any>();
    const [selectedMonth, setSelectedMonth] = useState(moment());
    const [arr, setArr] = useState([]);
    const [loading, setLoading] = useState(true);
    function handlePreviousMonth() {
        setSelectedMonth(prevMonth => prevMonth.clone().subtract(1, 'month'));
    }

    function handleNextMonth() {
        setSelectedMonth(prevMonth => prevMonth.clone().add(1, 'month'));
    }
    const columnDefs: any = [
        {
            headerName: "Project Name",
            headerClass: "customcss",
            field: "projectName",
            sortable: true,
            filter: true,
            width: 200,
            cellStyle: { textAlign: 'center', borderRight: '1px solid #dde2eb' },
            pinned: "left",
        },
        {
            headerName: "Activity",
            headerClass: "customcss",
            field: "activity",
            sortable: true,
            filter: true,
            width: 180,
            cellStyle: { textAlign: 'center', borderRight: '1px solid #dde2eb' },
            pinned: "left",
        },
        {
            headerName: "Total Hours",
            headerClass: "customcss",
            field: "Sum",
            sortable: true,
            filter: true,
            width: 130,
            pinned: "left",
            cellStyle: { textAlign: 'center', borderRight: '1px solid #dde2eb' },
            // valueGeter: `${constValueGetter()}`

        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[0]}`,

            headerClass: "customcss", field: "date01",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[0] ? getDaysByMonth()[0] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            // cellStyle:(params:any)=>(currentDay > 1) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb',}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb',} 
            cellStyle: (params: any) => (currentDay > 1) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[1]}`,

            headerClass: "customcss", field: "date02",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[1] ? getDaysByMonth()[1] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 2) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[2]}`,

            headerClass: "customcss", field: "date03",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[2] ? getDaysByMonth()[2] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 3) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[3]}`,

            headerClass: "customcss", field: "date04",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[3] ? getDaysByMonth()[3] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 4) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[4]}`,

            headerClass: "customcss", field: "date05",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[4] === '' ) ? {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} : {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 5) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[5]}`,

            headerClass: "customcss", field: "date06",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[5] ? getDaysByMonth()[5] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 6) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[6]}`,

            headerClass: "customcss", field: "date07",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[6] ? getDaysByMonth()[6] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 7) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[7]}`,

            headerClass: "customcss", field: "date08",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[7] ? getDaysByMonth()[7] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 8) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[8]}`,

            headerClass: "customcss", field: "date09",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[8] ? getDaysByMonth()[8] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 9) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[9]}`,

            headerClass: "customcss", field: "date10",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[9] ? getDaysByMonth()[9] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 10) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[10]}`,
            headerClass: "customcss",
            field: "date11",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[10] ? getDaysByMonth()[10] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 11) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[11]}`,
            headerClass: "customcss",
            field: "date12",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[11] ? getDaysByMonth()[11] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 12) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[12]}`,
            headerClass: "customcss",
            field: "date13",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[12] ? getDaysByMonth()[12] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 13) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[13]}`,
            field: "date14",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[13] ? getDaysByMonth()[13] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 14) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[14]}`,
            field: "date15",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[14] ? getDaysByMonth()[14] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 15) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[15]}`,
            field: "date16",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[15] ? getDaysByMonth()[15] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 16) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[16]}`,
            field: "date17",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[16] ? getDaysByMonth()[16] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 17) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[17]}`,
            field: "date18",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[17] ? getDaysByMonth()[17] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 18) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[18]}`,
            field: "date19",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[18] ? getDaysByMonth()[18] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 19) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[19]}`,
            field: "date20",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[19] ? getDaysByMonth()[19] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 20) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[20]}`,
            field: "date21",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[20] ? getDaysByMonth()[20] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 21) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[21]}`,
            field: "date22",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[21] ? getDaysByMonth()[21] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 22) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[22]}`,
            field: "date23",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[22] ? getDaysByMonth()[22] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            // cellStyle:(params:any)=>(currentDay > 1) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb',}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb',} 
            cellStyle: (params: any) => (currentDay > 23) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[23]}`,
            field: "date24",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[23] ? getDaysByMonth()[23] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 24) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[24]}`,
            field: "date25",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[24] ? getDaysByMonth()[24] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 25) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[25]}`,
            field: "date26",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[25] ? getDaysByMonth()[25] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 26) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[26]}`,
            field: "date27",

            headerClass: "customcss", sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[26] ? getDaysByMonth()[26] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 27) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[27] ? getDaysByMonth(selectedMonth)[27] : ""}`,
            headerClass: "customcss",
            field: "date28",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[27] ? getDaysByMonth()[27] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 28) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[28] ? getDaysByMonth(selectedMonth)[28] : ""}`,
            headerClass: "customcss",
            field: "date29",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[28] ? getDaysByMonth()[28] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 29) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },
        {
            headerName: `${getDaysByMonth(selectedMonth)[29] ? getDaysByMonth(selectedMonth)[29] : ""}`,
            headerClass: "customcss",
            field: "date30",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[29] ? getDaysByMonth()[29] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 30) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },

        {
            headerName: `${getDaysByMonth(selectedMonth)[30] ? getDaysByMonth(selectedMonth)[30] : ""}`,
            headerClass: "customcss",
            field: "date31",
            sortable: true,
            filter: true,
            width: 130,
            // cellStyle:(params:any)=>(getDaysByMonth()[30] ? getDaysByMonth()[30] : 0) ? {backgroundColor:'gainsboro',textAlign:'center',borderRight:'1px solid #dde2eb'}: {backgroundColor:'#fff',textAlign:'Center',borderRight:'1px solid #dde2eb'} 
            // pinned: "left",
            cellStyle: (params: any) => (currentDay > 31) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
        },

    ];
    // function constValueGetter() {
    //     return 99999;
    // }








    function processDataForSelectedMonth(selectedMonth: any, items: any) {
        let data: any = [];
        items.forEach((item: any) => {
            const projectName = item.ProjectId.ProjectName;
            const timesheet = JSON.parse(item.TimeSheet);

            for (let i = 0; i < timesheet.length; i++) {
                const entry = timesheet[i];
                const date = Object.keys(entry)[0];

                if (getDaysByMonth(selectedMonth).includes(date)) {
                    const activities = entry[date];

                    Object.keys(activities).forEach((activity) => {
                        const hours = activities[activity];
                        const columnName = `date${date.replace(/-/g, '')}`;

                        const existingRow = data.find((row: any) => row.projectName === projectName && row.activity === activity);
                        if (existingRow) {
                            existingRow[columnName] = `${hours} `;
                        } else {
                            const newRow = {
                                projectName,
                                activity,
                                [columnName]: `${hours} `,
                            };
                            data.push(newRow);
                        }
                    });
                }

            }
        });

        function formatDateKeys(data: any) {
            const formattedData: any[] = [];

            for (const obj of data) {
                const formattedObj: any = {};

                for (const key in obj) {
                    if (key.startsWith('date')) {
                        const formattedKey = `date${key.slice(-8, -6)}`;
                        formattedObj[formattedKey] = obj[key];
                    } else {
                        formattedObj[key] = obj[key];
                    }
                }

                formattedData.push(formattedObj);
            }

            return formattedData;
        }

        const formattedData = formatDateKeys(data);

        if (formattedData) {
            formattedData.map((itr: any) => {
                let onlyDayValArr: any[] = [itr.date01,
                itr.date02,
                itr.date03,
                itr.date04,
                itr.date05,
                itr.date06,
                itr.date07,
                itr.date08,
                itr.date09,
                itr.date10,
                itr.date11,
                itr.date12,
                itr.date13,
                itr.date14,
                itr.date15,
                itr.date16,
                itr.date17,
                itr.date18,
                itr.date19,
                itr.date20,
                itr.date21,
                itr.date22,
                itr.date23,
                itr.date24,
                itr.date25,
                itr.date26,
                itr.date27,
                itr.date28,
                itr.date29 || 0,
                itr.date30 || 0,
                itr.date31 || 0,

                ]
                let intArr: any[] = []
                let sum = 0;

                onlyDayValArr.map((colItr: any) => {
                    intArr.push(parseInt(colItr))
                })
                let woNaNArr: any[] = intArr.map(value => isNaN(value) ? 0 : value)
                for (let i = 0; i < woNaNArr.length; i += 1) {
                    sum += woNaNArr[i];
                }
                itr.Sum = sum

            })

        }

        //   console.log("formattedData date is here.....",formattedData);

        return { data, formattedData };
    }
    //   const updatedData = processDataForSelectedMonth(selectedMonth, arr);
    //   console.log("New data is here.........", updatedData.data);
    //   console.log("New updatedData.formattedData is here.........", updatedData.formattedData);

    const onbuttonclick = (month: any) => {
        const updatedData = processDataForSelectedMonth(month, arr);
        console.log("New data is here.........", updatedData.data);
        console.log("New updatedData.formattedData is here.........", updatedData.formattedData);
        setRowData(updatedData.formattedData)
    }


    async function getUserReport() {
        try {
            var currentUser = await _SharepointServiceProxy.getCurrentUser();
            // setUserData(currentUser);
            let items = await _SharepointServiceProxy.getItems({
                listName: "Timesheet",
                fields: [
                    "ProjectId/ProjectName",
                    "ProjectId/ID",
                    "EmployeeId/Employee_Id",
                    "EmployeeId/EmpEmail",
                    "WeekNo",
                    "TimeSheet",
                ],
                expandFields: ["ProjectId", "EmployeeId"],
                filter: `EmployeeId/EmpEmail eq '${currentUser?.User?.Email}'`,
                // orderedColumn:"ID"
                isRoot: true
            })
            setArr(items);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        async function getData() {
            // var currentUser = await _SharepointServiceProxy.getCurrentUser();
            // setUserData(currentUser);
            // let currMonthStr = moment(new Date(), "DD-MM-YYYY")
            // let monthStr = currMonthStr.format('MMM')

            // async function getReportData() {
            //     let items = await _SharepointServiceProxy.getItems({
            //         listName: "TimeSheet",
            //         fields: [
            //             "Project_Id/ProjectName",
            //             "Project_Id/ID",
            //             "Employee_Id/Employee_Id",
            //             "Activity/Name",
            //             "Activity/ID",
            //             "Day_1",
            //             "Day_2",
            //             "Day_3",
            //             "Day_4",
            //             "Day_5",
            //             "Day_6",
            //             "Day_7",
            //             "Day_8",
            //             "Day_9",
            //             "Day_10",
            //             "Day_11",
            //             "Day_12",
            //             "Day_13",
            //             "Day_14",
            //             "Day_15",
            //             "Day_16",
            //             "Day_17",
            //             "Day_18",
            //             "Day_19",
            //             "Day_20",
            //             "Day_21",
            //             "Day_22",
            //             "Day_23",
            //             "Day_24",
            //             "Day_25",
            //             "Day_26",
            //             "Day_27",
            //             "Day_28",
            //             "Day_29",
            //             "Day_30",
            //             "Day_31",
            //             "TotalHours",
            //         ],
            //         expandFields: ["Project_Id", "Employee_Id", "Activity"],
            //         filter: `Employee_Id/Employee_Id eq '${currentUser?.User?.Id}' and Month eq '${monthStr}'`,
            //         // orderedColumn:"ID"
            //         isRoot: true
            //     })

            //     setPrjData(items);
            //     if (items) {
            //         items.map((itr: any) => {
            //             let onlyDayValArr: any[] = [itr.Day_1,
            //             itr.Day_2,
            //             itr.Day_3,
            //             itr.Day_4,
            //             itr.Day_5,
            //             itr.Day_6,
            //             itr.Day_7,
            //             itr.Day_8,
            //             itr.Day_9,
            //             itr.Day_10,
            //             itr.Day_11,
            //             itr.Day_12,
            //             itr.Day_13,
            //             itr.Day_14,
            //             itr.Day_15,
            //             itr.Day_16,
            //             itr.Day_17,
            //             itr.Day_18,
            //             itr.Day_19,
            //             itr.Day_20,
            //             itr.Day_21,
            //             itr.Day_22,
            //             itr.Day_23,
            //             itr.Day_24,
            //             itr.Day_25,
            //             itr.Day_26,
            //             itr.Day_27,
            //             itr.Day_28,
            //             itr.Day_29 || 0,
            //             itr.Day_30 || 0,
            //             itr.Day_31 || 0,

            //             ]
            //             let intArr: any[] = []
            //             let sum = 0;

            //             onlyDayValArr.map((colItr: any) => {
            //                 intArr.push(parseInt(colItr))
            //             })
            //             let woNaNArr: any[] = intArr.map(value => isNaN(value) ? 0 : value)
            //             for (let i = 0; i < woNaNArr.length; i += 1) {
            //                 sum += woNaNArr[i];
            //             }
            //             itr.Sum = sum

            //         })

            //     }

            //     setRowData(items);
            //     console.log(prjData);
            // }


            // getReportData();

            // getUserReport()
        }
        setCurrentDay(parseInt(format(new Date(), 'dd')))
        getData();
        getDaysArrayByMonth();
        getUserReport();
        onbuttonclick(selectedMonth);
        // getDaysByMonthforWeekNo();
    }, [])
    useEffect(() => {
        if (!loading) {
            onbuttonclick(selectedMonth);
        }
    }, [loading, selectedMonth]);


    // console.log("UserData", userData);


    function getDaysArrayByMonth() {
        var daysInMonth = moment().daysInMonth();
        var arrDays = [];

        while (daysInMonth) {
            var current = moment().date(daysInMonth);
            arrDays.push(current);
            daysInMonth--;
        }
        // console.log('arr Days', arrDays)
        return arrDays;
    }

    function getDaysByMonth(month: any) {
        let arrDays: any = [];
        const daysInMonth = month.daysInMonth();
        for (let day = 1; day <= daysInMonth; day++) {
            const current = month.date(day).format('DD-MM-YYYY');
            arrDays.push(current);
        }

        return arrDays;
    }


    // function getDaysByMonthforWeekNo() {

    // for (const date of sortDateArr) {
    //     weekNumber(date);
    //   }
    // //   console.log("array days ssss",arraDays)
    // function weekNumber(allDates: any) {
    //     const d: any = new Date(allDates);
    //     var Year: any = new Date(d.getFullYear(), 0, 1);
    //     var days = Math.floor((d - Year) / (24 * 60 * 60 * 1000));
    //     let weeks = Math.ceil((d.getDay() + 1 + days) / 7);
    //     let WeekNo = 'Week' + weeks;
    //     console.log("Week number is...", WeekNo)
    //     // getUserReport(WeekNo)

    // }

    const onBtnExport = useCallback(() => {
        gridRef.current.api.exportDataAsCsv();
    }, []);

    const CalloutProps = {
        styles: {
            content: { color: '#fff' }
        },
        calloutProps: {
            styles: {
                beak: { background: '#000' },
                beakCurtain: { background: '#000' },
                calloutMain: { background: '#000' },
            },
        },
    }

    return (
        <>
            {/* <div className='body-color'> */}
                <div className="container-fluid">
                    <div className="main-container">
                        <div className="col-md-12 pt-2 d-flex">
                            <div className='row mx-0'>
                               
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className='d-flex'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="30" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        </svg>

                                    </div>
                                    <div>
                                        <h4 className="mb-0">User Report</h4>
                                        <p className="mb-0">
                                            <span
                                                className="text-primary cursor-pointer"
                                                onClick={() => navigate("")}
                                            >
                                                Dashboard
                                            </span>{" "}
                                            /{" "}

                                            <span className="cursor-pointer" onClick={() => navigate("")}>
                                                Report
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                
                            </div>
                        </div>



                        {/* <div className="row mt-4 pt-2 ms-1 me-1">
                            <div className="card card-back">
                                <div className="col-md-12 d-flex justify-content-between">
                                    <div className="d-flex pt-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="30" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                        </svg>
                                        <h4 className="mb-0">
                                            User Report
                                        </h4>
                                    </div>
                                    <div>
                                        <p className="bredcram-subhead mt-2 pt-2">
                                            <span
                                                className="text-primary cursor-pointer"
                                                onClick={() => navigate("")}
                                            >
                                                Dashboard
                                            </span>
                                            <span className="text-white"> / </span>
                                            <span
                                                className="cursor-pointer text-white"
                                                onClick={() => navigate("")}
                                            >
                                                Report
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}





                        <div className="row">
                            <div className="d-flex py-2 col-6">
                                {/* <button className='btn btn-primary' onClick={() => { handlePreviousMonth(), onbuttonclick(selectedMonth); }}>
                                    <img src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/arrowl.png'} alt="" width={20} />
                                    Previous Month
                                </button> */}
                                <div className="icon-containers">
                                    <div onClick={() => { handlePreviousMonth(), onbuttonclick(selectedMonth); }} className="icon cursor-pointer">
                                        <i className="fas fa-arrow-left"></i>
                                    </div>
                                </div>

                                <div className='col-md-4 fs-4 text-center'>{selectedMonth.format('MMMM YYYY')}</div>

                                {/* <button className='btn btn-primary' onClick={() => { handleNextMonth(); onbuttonclick(selectedMonth); }}>
                                    Next Month
                                    <img src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/arrow.png'} alt="" width={20} />
                                </button> */}
                                <div className="icon-containers">
                                    <div onClick={() => { handleNextMonth(), onbuttonclick(selectedMonth); }} className="icon cursor-pointer">
                                        <i className="fas fa-arrow-right"></i>
                                    </div>
                                </div>
                            </div>

                            <div className='d-flex  justify-content-end text-danger fw-semibold pt-4 col-6'>
                                <TooltipHost
                                    tooltipProps={CalloutProps}
                                    content="Download CSV"
                                    closeDelay={300}
                                    id="Download_CSV"
                                    directionalHint={DirectionalHint.rightCenter}
                                    className="d-inline-block px-2 py-2">
                                    <button className='mx-2' onClick={onBtnExport}>
                                        <img src="../../SiteAssets/images/csv.png" alt="" width={20} />
                                    </button>
                                </TooltipHost>

                                <p className='para-size mb-0'>*Unit in Hours
                                </p>
                            </div>
                        </div>
                        <div className="">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="card shadow">
                                        <div className="card-body">
                                            <div className="row">


                                                <div className="ag-theme-alpine" id='gridContainer' style={{ height: 455 }} >
                                                    <AgGridReact
                                                        ref={gridRef}
                                                        rowData={paginatedArrEmployee}
                                                        columnDefs={columnDefs}
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
                </div>
            {/* </div> */}
            <Pagination
                orgData={rowData}
                setNewFilterarr={setPaginatedArrEmployee}
            />

        </>
    )
}

export default Report