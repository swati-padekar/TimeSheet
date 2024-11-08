import * as React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react';
import SharepointServiceProxy from '../common/sp-proxy/SharepointServiceProxy';
import * as _ from 'lodash'
import { ITimesheetProps } from '../ITimesheetProps';
import * as moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { ComboBox, DirectionalHint, IComboBox, IComboBoxOption, IComboBoxStyles, TooltipHost } from '@fluentui/react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { format } from 'date-fns';
import Pagination from '../common/Pagination';

const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };

const ProjectReport: React.FunctionComponent<ITimesheetProps> = (props: any) => {

  const _SharepointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props?.context, props?.webURL);
  const _TimesheetProxy: SharepointServiceProxy =  new SharepointServiceProxy(props?.context, props?.webURL);

  const [returnedTarget, setreturnedTarget] = useState<any[]>([]);
  const [data, setData] = React.useState({
    ProjectName: "",
  })
  const gridRef = useRef<any>();
  const [showTable, setShowTable] = useState<boolean>(false)
  const [fiteredByProjectName, setByProjectData] = useState<any>()
  const [fiteredProjectData, setfiteredProjectData] = useState<any>()
  const [rowData, setRowData] = useState([]);
  const [paginatedArrEmployee, setPaginatedArrEmployee] = useState<any>()
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState<number>()
  const [selectedMonth, setSelectedMonth] = useState(moment());
  const [arr, setArr] = useState([]);
  const [loading, setLoading] = useState(true);


  function handlePreviousMonth() {
    setSelectedMonth(prevMonth => prevMonth.clone().subtract(1, 'month'));
  }

  function handleNextMonth() {
    setSelectedMonth(prevMonth => prevMonth.clone().add(1, 'month'));
  }


  function processDataForSelectedMonth(selectedMonth: any, items: any) {
    let data: any = [];
    items.forEach((item: any) => {
      const EmployeeName = item.EmployeeId.Name;
      const timesheet = JSON.parse(item.TimeSheet);

      for (let i = 0; i < timesheet.length; i++) {
        const entry = timesheet[i];
        const date = Object.keys(entry)[0];

        if (getDaysByMonth(selectedMonth).includes(date)) {
          const activities = entry[date];

          Object.keys(activities).forEach((activity) => {
            const hours = activities[activity];
            const columnName = `date${date.replace(/-/g, '')}`;

            const existingRow = data.find((row: any) => row.EmployeeName === EmployeeName && row.activity === activity);
            if (existingRow) {
              existingRow[columnName] = `${hours} `;
            } else {
              const newRow = {
                EmployeeName,
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


    return { data, formattedData };
  }
  const onbuttonclick = (month: any, items: any) => {
    const updatedData = processDataForSelectedMonth(month, items);
    setRowData(updatedData.formattedData)
  }














  const onChangeProjectReportTypeHead = async (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): Promise<void> => {
    setData({ ...data, ProjectName: value })
    setShowTable(true)

    try {
      let items = await _SharepointServiceProxy.getItems({
        listName: "Timesheet",
        fields: [
          "ProjectId/ProjectName",
          "ProjectId/ID",
          "EmployeeId/Employee_Id",
          "EmployeeId/Name",
          "WeekNo",
          "TimeSheet",
        ],
        expandFields: ["ProjectId", "EmployeeId"],
        filter: `ProjectId/ProjectName eq '${option.text}'`,
        // orderedColumn:"ID"
        isRoot: true
      })
      setArr(items);
      onbuttonclick(moment(), items)
      setSelectedMonth(moment())
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }

  };

  useEffect(() => {
    if (!loading) {
      onbuttonclick(selectedMonth, arr);
    }
  }, [loading, selectedMonth]);

  async function ProjectReportData() {
    let currentManager;
    var currentUser = await _TimesheetProxy.getCurrentUser().then(async (res: any) => {
      return res;
    });
    let items = await _SharepointServiceProxy.getItems({
      listName: "Project",
      fields: ["ProjectName", "ProjectManager"],
      isRoot: true
    });
  
    if (currentUser.Groups[0]?.Title === "TS_TimeSheetAdmin") {
      currentManager = items;
    } else {
      currentManager = items.filter((ftr) => ftr.ProjectManager === currentUser.User.Title)
    }

    // combobox data bind
    // managerData
    let partialArr = currentManager.map(({ ProjectName }) => ({
      key: ProjectName,
      text: ProjectName,
    }));
    setreturnedTarget(_.uniqWith(partialArr, _.isEqual));
  }

  useEffect(() => {
    ProjectReportData();
    setCurrentWeek(parseInt(format(new Date(), 'dd')));
  }, []);




  //   Filter for searching Project Name //
  React.useEffect(() => {
    let fltrproject = returnedTarget.filter((a: any) =>
      fiteredByProjectName ? a.text.toLowerCase().includes(fiteredByProjectName.toLowerCase())
        : a
    )
    setfiteredProjectData(fltrproject)
  }, [fiteredByProjectName, returnedTarget])



  // tooltip CalloutProps
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

  const columnDefs: any = [
    //const [columnDefs] = useState([
    {
      headerName: "Employee Name",
      headerClass: "customcss",
      field: "EmployeeName",
      sortable: true,
      filter: true,
      width: 200,
      pinned: "left",
    },
    {
      headerName: "Activity	",
      headerClass: "customcss",
      field: "activity",
      sortable: true,
      filter: true,
      width: 180,
      pinned: "left",
    },
    {
      headerName: "Total Hours",
      headerClass: "customcss",
      field: "Sum",
      sortable: true,
      filter: true,
      width: 130,
      cellStyle: { textAlign: 'center', width: 130 },
      pinned: "left",
      // valueGeter: `${constValueGetter()}`

    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[0]}`,
      headerClass: "customcss",
      field: "date01",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 1) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }

      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[1]}`,
      headerClass: "customcss",
      field: "date02",
      // sortable: true,
      // filter: true,
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 2) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[2]}`,
      headerClass: "customcss",
      field: "date03",
      // sortable: true,
      // filter: true,
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 3) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }

      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[3]}`,
      headerClass: "customcss",
      field: "date04",
      // sortable: true,
      // filter: true,
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 4) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }

      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[4]}`,
      headerClass: "customcss",
      field: "date05",
      sortable: true,
      filter: true,
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 5) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[5]}`,
      field: "date06",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 6) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[6]}`,
      field: "date07",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 7) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[7]}`,
      field: "date08",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 8) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[8]}`,
      field: "date09",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 9) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[9]}`,
      field: "date10",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 10) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[10]}`,
      field: "date11",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 11) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[11]}`,
      field: "date12",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 12) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[12]}`,
      field: "date13",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 13) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[13]}`,
      field: "date14",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 14) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[14]}`,
      field: "date15",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 15) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[15]}`,
      field: "date16",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 16) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[16]}`,
      field: "date17",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 17) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[17]}`,
      field: "date18",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 18) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[18]}`,
      field: "date19",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 19) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[19]}`,
      field: "date20",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 20) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[20]}`,
      field: "date21",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 21) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[21]}`,
      field: "date22",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 22) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[22]}`,
      field: "date23",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 23) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[23]}`,
      field: "date24",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 24) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[24]}`,
      field: "date25",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 25) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[25]}`,
      field: "date26",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 26) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[26]}`,
      field: "date27",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 27) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },


    {
      headerName: `${getDaysByMonth(selectedMonth)[27] ? getDaysByMonth(selectedMonth)[27] : ""}`,
      field: "date28",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 28) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[28] ? getDaysByMonth(selectedMonth)[28] : ""}`,
      field: "date29",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 29) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[29] ? getDaysByMonth(selectedMonth)[29] : ''}`,
      field: "date30",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 30) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },
    {
      headerName: `${getDaysByMonth(selectedMonth)[30] ? getDaysByMonth(selectedMonth)[30] : ""}`,
      field: "date31",
      headerClass: "customcss",
      width: 130,
      // cellStyle: { textAlign: 'center', width: 110 },
      cellStyle: (params: any) => (currentWeek > 31) ? { backgroundColor: 'gainsboro', textAlign: 'center', borderRight: '1px solid #dde2eb', } : { backgroundColor: '#fff', textAlign: 'Center', borderRight: '1px solid #dde2eb', }
      // pinned: "left",
    },

  ];
  // function constValueGetter() {
  //   return 99999;
  // }

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, []);

  const CalloutProps2 = {
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



  function getDaysByMonth(month: any) {
    let arrDays: any = [];
    const daysInMonth = month.daysInMonth();
    for (let day = 1; day <= daysInMonth; day++) {
      const current = month.date(day).format('DD-MM-YYYY');
      arrDays.push(current);
    }

    return arrDays;
  }
  return (
    <>
      <div className='body-color'>
        <div className="container-fluid">
          <div className="main-container">
            <div className="col-md-12">
              <div className='row'>
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
                          className="text-primary cursor-pointer"
                          onClick={() => navigate("")}
                        >
                          Report
                        </span>{" "}
                        <span
                          className=" cursor-pointer"
                          onClick={() => navigate("")}
                        >
                          /{" "}
                          Projects
                        </span>{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row my-2 col-md-2 project-type-ahed">
                <TooltipHost
                  tooltipProps={CalloutProps}
                  content="Projects"
                  closeDelay={300}
                  id="Projects"
                  directionalHint={DirectionalHint.rightCenter}
                  className="d-inline-block px-2 py-2">
                  <ComboBox
                    options={fiteredProjectData}
                    styles={comboBoxStyles}
                    allowFreeform
                    autoComplete="on"
                    onChange={onChangeProjectReportTypeHead}
                    onKeyUp={(e: any) => setByProjectData(e.target.value)}
                  />
                </TooltipHost>
              </div>
            </div>

            {showTable &&
              <>
                <div className="row">
                  <div className="d-flex col-md-6 pb-1">
                    {/* <button className='btn btn-primary' onClick={() => { handlePreviousMonth(), onbuttonclick(selectedMonth); }}>
                    <img src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/arrowl.png'} alt="" width={20} />
                    Previous Month
                  </button> */}
                    <div className="icon-containers">
                      <div onClick={() => { handlePreviousMonth(), onbuttonclick(selectedMonth, arr); }} className="icon cursor-pointer">
                        <i className="fas fa-arrow-left"></i>
                      </div>
                    </div>


                    <div className='col-md-4 fs-4 text-center'>{selectedMonth.format('MMMM YYYY')}</div>

                    {/* <button className='btn btn-primary' onClick={() => { handleNextMonth(); onbuttonclick(selectedMonth); }}>
                    Next Month
                    <img src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/arrow.png'} alt="" width={20} />
                  </button> */}
                    <div className="icon-container">
                      <div onClick={() => { handleNextMonth(), onbuttonclick(selectedMonth, arr); }} className="icon cursor-pointer">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </div>
                  <div className='d-flex col-md-6 justify-content-end text-danger fw-semibold pt-4'>
                    <TooltipHost
                      tooltipProps={CalloutProps2}
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


                            <div className="ag-theme-alpine" style={{ height: 405 }}>
                              <AgGridReact
                                ref={gridRef}
                                rowData={paginatedArrEmployee}
                                columnDefs={columnDefs}
                              // pagination={true}
                              //paginationPageSize={10}
                              >

                              </AgGridReact>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </>
            }
          </div>
        </div>
        <Pagination
          orgData={rowData}
          setNewFilterarr={setPaginatedArrEmployee}
        />
      </div>

    </>
  )
}

export default ProjectReport