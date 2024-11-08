
import * as React from 'react'
import { useEffect, useState } from 'react'
import { ComboBox, IComboBox, IComboBoxOption, IComboBoxStyles } from '@fluentui/react';
import SharepointServiceProxy from '../common/sp-proxy/SharepointServiceProxy';
import { ITimesheetProps } from '../ITimesheetProps';
import * as _ from 'lodash';
import * as moment from "moment";
import { useNavigate } from 'react-router-dom';
import { DirectionalHint, TooltipHost } from 'office-ui-fabric-react';
import Pagination from '../common/Pagination';
import AlertBox from '../common/AlertBox';



const Timesheetuser: React.FunctionComponent<ITimesheetProps> = (props: any) => {
    const _SharepointServiceProxy: SharepointServiceProxy = new SharepointServiceProxy(props?.context, props?.webURL);
    const comboBoxStyles: Partial<IComboBoxStyles> = { root: { maxWidth: 300 } };
    const [returnedTarget, setreturnedTarget] = useState<any[]>([]);
    const [userData, setUserData] = useState<any>({});
    const [weekDays, setWeekDays] = useState<any>([]);
    const [currentWeekDays, setCurrentWeekDays] = useState<any>([]);
    const [empID, setEmpID] = useState<number>()
    const [selectedProjectID, setSelectedProjectID] = useState<any>("");
    const [activityData, setActivityData] = useState<any>([]);
    const [otherActivity, setOtherActivity] = useState<any>([]);
    const [showHide, setShowHide] = useState<boolean>(false);
    const [fiteredByProjectName, setByProjectData] = useState<any>()
    const [fiteredProjectData, setfiteredProjectData] = useState<any>()
    const [ProjectName, setProjectName] = useState<any>()
    let [previousDate, setpreviousDate] = useState<any>(new Date())
    const [prevflag, setprevflag] = useState<any>(false)
    const [nexflag, setnextflag] = useState<any>(false)
    const [defaultInpData, setDefValInpData] = useState<any>([]);
    const [myArray, setMyArray] = useState([]);
    const [objtoupdatelist, setObjToupdateList] = useState([]);
    const [weekNumber, setWeekNo] = useState('');
    const [Week, setWeekNumber] = useState('');
    const [timesheet, setTimesheet] = useState([]);
    const [timesheets, setTimesheets] = useState([]);
    const [hours, setHoursTime] = useState([]);
    const [listItems, setListItems] = useState([]);
    const [PaginatedArrTimeSheet, setPaginatedArrTimeSheet] = useState<any>()
    const [disableInput, setDisableInput] = useState<any>(false)

    //Below are the POPUP states
    const [openModal, setOpenModal] = useState<string>("")
    const [weekValidationMsg, setWeekValidation] = useState<string>("")
    const [submitHours, setSubmitHours] = useState<string>("")
    const navigate = useNavigate();
    // let [timeSheet , setTimeSheetData] = useState<any>([])



    const [myArrays, setMyArrays] = useState([]);

    // ------------Below is the code for Disable the next week button-------------------------------//
    const [currentWeekStartDates, setCurrentWeekStartDate] = useState(new Date()); // The current week start date
    const today = new Date();
    today.setHours(0, 0, 0, 0)

    const goToPreviousWeek = () => {
        const previousWeekStartDate = new Date(currentWeekStartDates);
        previousWeekStartDate.setDate(previousWeekStartDate.getDate() - 7);
        setCurrentWeekStartDate(previousWeekStartDate);
    };

    const goToNextWeek = () => {
        const nextWeekStartDate = new Date(currentWeekStartDates);
        nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);
        setCurrentWeekStartDate(nextWeekStartDate);
    };

    // Disable or enable the next week button based on the current week start date
    const isNextWeekButtonDisabled = currentWeekStartDates > today;


    // ------------------------------------------------------------------------------------------------//


    useEffect(() => {
        const today = new Date();
        const weekday: any[] = [];
        for (let i = 0; i < 7; i++) {
            weekday.push(moment(new Date(today.setDate(today.getDate() - today.getDay() + i)).toUTCString()).format("YYYY-MM-DD"));
        }
        setWeekDays(weekday)
        setCurrentWeekDays(weekday)
        getEmpIdFrmCurrUser()
        getProjectTypeahed();
        actvityData();
        let formattedCurrentWeekStartDate = weekday[0]
        DefaultvalueFunction(selectedProjectID, formattedCurrentWeekStartDate)

    }, [])


    async function listitems(selectedProjectID: any) {
        const date: any = new Date();
        const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const weekNumber = Math.ceil(dayOfYear / 7);
        let WeekNo = 'Week' + weekNumber;


        let items = await _SharepointServiceProxy.getItems({
            listName: "Timesheet",
            fields: [
                "ProjectId/ID",
                "ProjectId/ProjectName",
                "EmployeeId/Employee_Id",
                "EmployeeId/EmpEmail",
                "ID",
                "TimeSheet",
                "WeekNo",
                "Status"
            ],
            expandFields: ["ProjectId", "EmployeeId"],
            filter: `EmployeeId/EmpEmail eq '${userData}' and
             ProjectId/ID eq '${selectedProjectID}' and WeekNo eq '${WeekNo}'`,
            isRoot: true,
        });
        if (items.length > 0 && items[0].Status === "In Process" || !items || items.length === 0) {
            setDisableInput(false)
        }
        else {
            setDisableInput(true)
        }
    }




    async function getTimeSheet1(WeekNo: any, date: any, activityName: any, inputValue: any) {
        let items = await _SharepointServiceProxy.getItems({
            listName: "Timesheet",
            fields: [
                "ProjectId/ID",
                "ProjectId/ProjectName",
                "EmployeeId/Employee_Id",
                "EmployeeId/EmpEmail",
                "ID",
                "TimeSheet",
                "WeekNo",
                "Status"
            ],
            expandFields: ["ProjectId", "EmployeeId"],
            filter: `EmployeeId/EmpEmail eq '${userData}' and
             ProjectId/ID eq '${selectedProjectID}' and WeekNo eq '${WeekNo}'`,
            isRoot: true,
        });

        let timesheet: any;
        var matchingProjects = items.filter(function (project) {
            return project.ProjectId.ProjectName === ProjectName;
        });

        // Iterate over matching projects
        matchingProjects.forEach(function (project) {
            timesheet = JSON.parse(project.TimeSheet);

            var existingEntry = timesheet.find(function (entry: any) {
                return Object.keys(entry)[0] === dateDMY(date);
            });

            if (existingEntry) {

                const newInputs = { date: dateDMY(date), activity: activityName, value: inputValue };
                setMyArrays(prevArrays => [...prevArrays, newInputs]);

                setTimesheets(JSON.parse(items[0].TimeSheet))


            } else {


                const newInputs = { date: dateDMY(date), activity: activityName, value: inputValue };
                setMyArrays(prevArrays => [...prevArrays, newInputs]);
                setTimesheets(JSON.parse(items[0].TimeSheet))


            }

            project.TimeSheet = JSON.stringify(timesheet);

        });



        let WeekNumber: any;
        for (let i = 0; i < items.length; i++) {
            if (items[i].WeekNo === WeekNo) {
                WeekNumber = items[i];
                break; // Exit the loop once a match is found
            }
        }
        setWeekNo(WeekNumber)
        setWeekNumber(WeekNo)
        setListItems(items)
    }
    // -----------------------------------------------//
    useEffect(() => {


        // const obj: any = [];

        // Iterate through the input data
        for (const item of myArrays) {
            const { date, activity, value } = item;

            // Check if the date already exists in the result object
            const existingDate = timesheets.find((objItem: any) => objItem[date]);

            if (existingDate) {
                // If the date exists, add the activity and value to the existing date's object
                existingDate[date][activity] = value;
            } else {
                // If the date doesn't exist, create a new object for the date and add the activity and value
                const newDateObj = { [date]: { [activity]: value } };
                timesheets.push(newDateObj);
            }
        }
        setTimesheet(timesheets)
    }, [myArray, timesheets]);
    // -----------------------------------//
    async function saveInProcessTimesheet() {
        if (weekNumber) {
            if (Object.keys(timesheet).length === 0) {
                // alert("No data to save");
                setWeekValidation("Please change or add in input box")
                return;
            }
            DefaultvalueFunction(selectedProjectID, weekDays[0])

            const data = {
                // WeekNo: WeekNo,
                TimeSheet: JSON.stringify(timesheet),
                Status: 'In Process'
            }
            let result = await _SharepointServiceProxy.updateItem(
                "Timesheet",
                listItems[0].ID,
                data,
                [],
                true
            );
            console.log(result)
            // alert('Week Number matched data updated succesfully')
        }
        else if (listItems && listItems.length > 0) {
            if (Object.keys(objtoupdatelist).length === 0) {
                // alert("No data to save");
                setWeekValidation("Please change or add in input box")
                return;
            }
            const data = {
                WeekNo: Week,
                TimeSheet: JSON.stringify(objtoupdatelist),
                Status: 'In Process'
            }
            let result = await _SharepointServiceProxy.updateItem(
                "Timesheet",
                listItems[0].ID,
                data,
                [],
                true
            );
            console.log(result)
            // alert("Week Number not matched data updated succesfully")
        }
        else {

            if (Object.keys(objtoupdatelist).length === 0) {
                // alert("No data to save");
                setWeekValidation("Please change or add in input box")
                return;
            }
            const data = {
                ProjectIdId: selectedProjectID,
                "EmployeeIdId": empID,
                WeekNo: Week,
                TimeSheet: JSON.stringify(objtoupdatelist),
                Status: 'In Process'
            }
            DefaultvalueFunction(selectedProjectID, weekDays[0])

            let result = await _SharepointServiceProxy.addItem("Timesheet", data, [], true);
            console.log(result)
        }
        setOpenModal("Data Saved Successfully")
    }



    useEffect(() => {
        // Retrieve the state from localStorage when the component mounts
        const storedDisableInput = localStorage.getItem('disableInput');
        if (storedDisableInput) {
            setDisableInput(JSON.parse(storedDisableInput));
        }
    }, []);

    useEffect(() => {
        // Store the state in localStorage whenever it changes
        localStorage.setItem('disableInput', JSON.stringify(disableInput));
    }, [disableInput]);


    async function submitTimesheet() {
        const date: any = new Date(weekDays[0]);
        const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const weekNumber = Math.ceil(dayOfYear / 7);
        let WeekNo = 'Week' + weekNumber;


        let items = await _SharepointServiceProxy.getItems({
            listName: "Timesheet",
            fields: [
                "ProjectId/ID",
                "ProjectId/ProjectName",
                "EmployeeId/Employee_Id",
                "EmployeeId/EmpEmail",
                "ID",
                "TimeSheet",
                "WeekNo",
                "Status"
            ],
            expandFields: ["ProjectId", "EmployeeId"],
            filter: `EmployeeId/EmpEmail eq '${userData}' and
             ProjectId/ID eq '${selectedProjectID}' and WeekNo eq '${WeekNo}'`,
            isRoot: true,
        });

        // ---------------Calculate the activities sum----------------------
        // let JsonDataSum = JSON.parse(items[0].TimeSheet)
        // let sum = 0;
        // for (const obj of JsonDataSum) {
        //     for (const key in obj) {
        //         const activities = obj[key];
        //         for (const activity in activities) {
        //             const value = parseInt(activities[activity]);
        //             if (!isNaN(value)) {
        //                 sum += value;
        //             }
        //         }
        //     }
        // }

        // console.log("Sum of all activities:", sum);
        // ---------------------------------------------------------//

        if (items[0].Status == "In Process") {

            const data = {
                Status: 'Submitted'
            }
            let result = await _SharepointServiceProxy.updateItem(
                "Timesheet",
                items[0].ID,
                data,
                [],
                true
            );
            console.log(result)
            // alert('Data Submitted successfully')
            setSubmitHours('Data Submitted successfully')
            setDisableInput(true)

        }
        else {
            // alert('The weekly hours should be 40 hours')
            // setWeekValidation("The weekly hours should be 40 hours")
            setDisableInput(false)
        }
    }

    // const EditTimesheet = () => {
    //     setDisableInput(false)
    // }


    async function getEmpIdFrmCurrUser() {
        let currentUser = await _SharepointServiceProxy.getCurrentUser();
        setUserData(currentUser.User.Email);

        let empName: any = await _SharepointServiceProxy.getItems({
            listName: "Employee",
            fields: ["ID", "Employee_Id", "Name"],
            orderedColumn: "Created",
            filter: `EmpEmail eq '${currentUser?.User?.Email}'`,
            isRoot: true
        });

        // pass Employee Id
        // let getEmpID = empName.find((fnd: any) => {
        //     if (fnd.Employee_Id == currentUser.User.Id) {
        //         return fnd.ID;
        //     }
        // });
        setEmpID(empName[0]?.ID)
    }



    async function actvityData() {
        let currUserActivities = await _SharepointServiceProxy.getItems({
            listName: "Activity",
            fields: ["Name", "ID", "Designation"],
            isRoot: true
        });
        setActivityData(_.uniqBy(currUserActivities, "Name"));

        let otherActivities = await _SharepointServiceProxy.getItems({
            listName: "Activity",
            fields: ["Name", "ID"],
            filter: `Name eq 'Bench'`,
            isRoot: true
        });
        setOtherActivity(otherActivities);

    }

    useEffect(() => {


        const obj: any = [];

        // Iterate through the input data
        for (const item of myArray) {
            const { date, activity, value } = item;

            // Check if the date already exists in the result object
            const existingDate = obj.find((objItem: any) => objItem[date]);

            if (existingDate) {
                // If the date exists, add the activity and value to the existing date's object
                existingDate[date][activity] = value;
            } else {
                // If the date doesn't exist, create a new object for the date and add the activity and value
                const newDateObj = { [date]: { [activity]: value } };
                obj.push(newDateObj);
            }
        }
        setObjToupdateList(obj)
    }, [myArray]);

    const timeSheetData = (dateVal: any, inValue: any, activityId: any, activityName: any, i: any) => {
        const date: any = new Date(dateVal);
        const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const weekNumber = Math.ceil(dayOfYear / 7);
        let WeekNo = 'Week' + weekNumber;
        const InputsData = { date: dateDMY(dateVal), activity: activityName, value: inValue };
        setMyArray(prevArrays => [...prevArrays, InputsData]);

        getTimeSheet1(WeekNo, dateVal, activityName, inValue);
    }

    const onChangeProjectTypeHead = (event: React.FormEvent<IComboBox>, option?: IComboBoxOption, index?: number, value?: string): void => {
        if (option) {
            const key = option.key
            setSelectedProjectID(key)
            listitems(key)
            let today = moment().format('YYYY-MM-DD')
            DefaultvalueFunction(key, today)
            setProjectName(option.text)
            setShowHide(true)
            // defaultvalListData(key)
            getProjectHours(key)
            actvityData();

        }
    };

    const dateDMY = (date: any) => {
        if (date && date != undefined) {
            let myArray = date?.split("-");
            let newDateDYM = myArray[2] + "-" + myArray[1] + "-" + myArray[0] ? myArray[2] + "-" + myArray[1] + "-" + myArray[0] : 0;
            return newDateDYM ? newDateDYM : 0

        }
        return 0

    }





    const data = (selectedProjectID == 448) ? otherActivity : activityData






    //   Filter for searching Project Name //
    React.useEffect(() => {
        let fltrproject = returnedTarget.filter((a: any) =>
            fiteredByProjectName ? a.text.toLowerCase().includes(fiteredByProjectName.toLowerCase())
                : a
        )
        setfiteredProjectData(fltrproject)
    }, [fiteredByProjectName, returnedTarget])



    async function getProjectTypeahed() {
        let partialArr: any = []
        let currentUser = await _SharepointServiceProxy.getCurrentUser();
        var filterYear = `EmployeeId/EmpEmail eq '${currentUser?.User?.Email}'`;
        let projectListItems = await _SharepointServiceProxy.getItems({
            listName: "ProjectsAllocations",
            fields: ["ID",
                "Project_ID/ID",
                "Project_ID/ProjectName",
                "EmployeeId/ID",
                "EmployeeId/Name",
            ],
            expandFields: ["Project_ID", "EmployeeId"],
            itemId: null,
            filter: filterYear,
            top: 500,
            isRoot: true,
            orderedColumn: "ID"
        });

        projectListItems.forEach((element: any) => {
            partialArr.push({
                key: element?.Project_ID?.ID,
                text: element.Project_ID?.ProjectName
            }
            );
        })


        setreturnedTarget(_.uniqWith(partialArr, _.isEqual))
        // setreturnedTarget(items)   
    }

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

    async function prevWeek() {
        var previousWeekallDates: any[] = [];
        let currproject = await _SharepointServiceProxy.getItems({
            listName: "Project",
            fields: ["ProjectName", "ID", "StartDate", "EndDate"],
            filter: `ProjectName eq '${ProjectName}'`,
            isRoot: true
        });

        let startDate = moment(currproject[0]?.StartDate).format("YYYY-MM-DD").toString();

        var startingDate = new Date(previousDate);
        startingDate.setDate(startingDate.getDate() - 7);


        for (var i = 0; i < 7; i++) {
            var date = new Date(startingDate);
            let cmpdate = (moment(new Date(date.setDate(date.getDate() - date.getDay() + i)).toUTCString()).format("YYYY-MM-DD"));

            if (startDate <= cmpdate) {

                previousWeekallDates.push(moment(date).format("YYYY-MM-DD").toString())
                setnextflag(false)
            }
            else {
                setprevflag(true)
                // setnextflag(false)
            }

        }

        setpreviousDate(new Date(previousWeekallDates[0]))
        setWeekDays(previousWeekallDates);

        let formattedCurrentWeekStartDate = previousWeekallDates[0];
        DefaultvalueFunction(selectedProjectID, formattedCurrentWeekStartDate)

        const dates: any = new Date(previousWeekallDates[0]);
        const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((dates - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const weekNumber = Math.ceil(dayOfYear / 7);
        let WeekNo = 'Week' + weekNumber;


        let items = await _SharepointServiceProxy.getItems({
            listName: "Timesheet",
            fields: [
                "ProjectId/ID",
                "ProjectId/ProjectName",
                "EmployeeId/Employee_Id",
                "EmployeeId/EmpEmail",
                "ID",
                "TimeSheet",
                "WeekNo",
                "Status"
            ],
            expandFields: ["ProjectId", "EmployeeId"],
            filter: `EmployeeId/EmpEmail eq '${userData}' and
             ProjectId/ID eq '${selectedProjectID}' and WeekNo eq '${WeekNo}'`,
            isRoot: true,
        });
        if (items[0].Status === "Submitted" || items.length === 0) {
            setDisableInput(true)
        }
        else {
            setDisableInput(false)
        }

    }
    async function currWeek() {
        // var currentDate = new Date();

        const today = new Date();
        const weekday = [];
        for (let i = 0; i < 7; i++) {
            weekday.push(moment(new Date(today.setDate(today.getDate() - today.getDay() + i)).toUTCString()).format("YYYY-MM-DD"));
        }
        setWeekDays(weekday);
        let formattedCurrentWeekStartDate = weekday[0]
        DefaultvalueFunction(selectedProjectID, formattedCurrentWeekStartDate)

        const date: any = new Date(weekday[0]);
        const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const weekNumber = Math.ceil(dayOfYear / 7);
        let WeekNo = 'Week' + weekNumber;

        let items = await _SharepointServiceProxy.getItems({
            listName: "Timesheet",
            fields: [
                "ProjectId/ID",
                "ProjectId/ProjectName",
                "EmployeeId/Employee_Id",
                "EmployeeId/EmpEmail",
                "ID",
                "TimeSheet",
                "WeekNo",
                "Status"
            ],
            expandFields: ["ProjectId", "EmployeeId"],
            filter: `EmployeeId/EmpEmail eq '${userData}' and
             ProjectId/ID eq '${selectedProjectID}' and WeekNo eq '${WeekNo}'`,
            isRoot: true,
        });
        if (items.length === 0) {
            setDisableInput(false)
        }
        if (items[0].Status === "Submitted") {
            setDisableInput(true)
        }
        else {
            setDisableInput(false)
        }
    }
    async function nextWeek() {
        let currproject = await _SharepointServiceProxy.getItems({
            listName: "Project",
            fields: ["ProjectName", "ID", "StartDate", "EndDate"],
            filter: `ProjectName eq '${ProjectName}'`,
            isRoot: true
        });

        let EndDate = moment(currproject[0]?.EndDate).format("YYYY-MM-DD").toString();

        var NextWeekallDates = [];


        var startingDate = new Date(previousDate);
        startingDate.setDate(startingDate.getDate() + 7);


        for (var i = 0; i < 7; i++) {
            var date = new Date(startingDate);
            // let cmpdate = moment(date.setDate(date.getDate() + i)).format("MM-DD-YYYY").toString();
            let cmpdate = (moment(new Date(date.setDate(date.getDate() - date.getDay() + i)).toUTCString()).format("YYYY-MM-DD"));
            if (EndDate >= cmpdate) {

                NextWeekallDates.push(moment(date).format("YYYY-MM-DD").toString())
                setprevflag(false)
            }
            else {
                setnextflag(true)
                // setprevflag(false)
            }

        }

        setpreviousDate(new Date(NextWeekallDates[0]))
        setWeekDays(NextWeekallDates);
        let formattedCurrentWeekStartDate = NextWeekallDates[0]
        DefaultvalueFunction(selectedProjectID, formattedCurrentWeekStartDate)

        const dates: any = new Date(NextWeekallDates[0]);
        const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((dates - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const weekNumber = Math.ceil(dayOfYear / 7);
        let WeekNo = 'Week' + weekNumber;


        let items = await _SharepointServiceProxy.getItems({
            listName: "Timesheet",
            fields: [
                "ProjectId/ID",
                "ProjectId/ProjectName",
                "EmployeeId/Employee_Id",
                "EmployeeId/EmpEmail",
                "ID",
                "TimeSheet",
                "WeekNo",
                "Status"
            ],
            expandFields: ["ProjectId", "EmployeeId"],
            filter: `EmployeeId/EmpEmail eq '${userData}' and
             ProjectId/ID eq '${selectedProjectID}' and WeekNo eq '${WeekNo}'`,
            isRoot: true,
        });
        if (items.length === 0) {
            setDisableInput(false)
        }
        if (items[0].Status === "Submitted") {
            setDisableInput(true)
        }
        else {
            setDisableInput(false)
        }

    }


    // Working code for default val
    //---------------------- Creating array of object for default value binding
    async function DefaultvalueFunction(ProjrctId: any, weekDates: any) {

        const date: any = new Date(weekDates);
        const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        const weekNumbers: any = Math.ceil(dayOfYear / 7);
        let WeekNos = 'Week' + weekNumbers;

        var currentUser = await _SharepointServiceProxy.getCurrentUser();
        let itemsForDefVal = await _SharepointServiceProxy.getItems({
            listName: "Timesheet",
            fields: [
                "ProjectId/ID",
                "EmployeeId/Employee_Id",
                "TimeSheet",
                "ID",
                "WeekNo"
            ],
            expandFields: ["ProjectId", "EmployeeId"],
            filter: `EmployeeId/EmpEmail eq '${currentUser?.User?.Email}' and
        ProjectId/ID eq '${ProjrctId}' and WeekNo eq '${WeekNos}'`,
            isRoot: true,
        });
        // setDefValInpData(itemsForDefVal)
        if (itemsForDefVal.length > 0) {
            setDefValInpData(JSON.parse(itemsForDefVal[0].TimeSheet))
            // setTimeSheetData(itemsForDefVal[0]?.TimeSheet)
        }
        else {
            setDefValInpData(null)
        }

    }


    // const parsedData = defaultInpData.reduce((result: any, item: any) => {
    //     const date = Object.keys(item)[0];
    //     result[date] = item[date];
    //     return result;
    // }, {});
    let parsedData: any = []
    if (defaultInpData && Array.isArray(defaultInpData)) {
        parsedData = defaultInpData.reduce((result: any, item: any) => {
            const date = Object.keys(item)[0];
            result[date] = item[date];
            return result;
        }, {});

        // Now you can use the parsedData object as needed.
    } else {
        // Handle the case when defaultInpData is null or not an array.
        console.error("defaultInpData is null or not an array.");
    }


    const sumPerDate: any = {};
    if (defaultInpData && Array.isArray(defaultInpData)) {
        defaultInpData.forEach((entry: any) => {
            const date = Object.keys(entry)[0];
            const tasks = Object.values(entry)[0];
            let sum = 0;

            Object.values(tasks).forEach(value => {
                if (value && !isNaN(parseInt(value))) {
                    sum += parseInt(value);
                }
            });

            sumPerDate[date] = sum;
        });
    }
    else {
        // Handle the case when defaultInpData is null or not an array.
        console.error("defaultInpData is null or not an array.");
    }

    async function getProjectHours(prjID: any) {

        let currentUser = await _SharepointServiceProxy.getCurrentUser();
        // var filterYear = `EmployeeId/EmpEmail eq '${currentUser?.User?.Email}'`;
        let projectListItemss = await _SharepointServiceProxy.getItems({
            listName: "ProjectsAllocations",
            fields: ["ID",
                "Project_ID/ID",
                "Project_ID/StartDate",
                "Project_ID/EndDate",
                "Project_ID/ProjectName",
                "EmployeeId/ID",
                "EmployeeId/Name",
                "Weak1", "Weak2", "Weak3", "Weak4", "Weak5", "Weak6", "Weak7", "Weak8", "Weak9", "Weak10",
                "Weak11", "Weak12", "Weak13", "Weak14", "Weak15", "Weak16", "Weak17", "Weak18", "Weak19", "Weak20",
                "Weak21", "Weak22", "Weak23", "Weak24", "Weak25", "Weak26", "Weak27", "Weak28", "Weak29", "Weak30",
                "Weak31", "Weak32", "Weak33", "Weak34", "Weak35", "Weak36", "Weak37", "Weak38", "Weak39", "Weak40",
                "Weak41", "Weak42", "Weak43", "Weak44", "Weak45", "Weak46", "Weak47", "Weak48", "Weak49", "Weak50",
                "Weak51", "Weak52"
            ],
            expandFields: ["Project_ID", "EmployeeId"],
            //    itemId:null,       
            filter: `EmployeeId/EmpEmail eq '${currentUser?.User?.Email}'
            and Project_ID/ID eq '${prjID}'`,
            //    top:500,
            isRoot: true,
            //    orderedColumn:"ID"
        });
        console.log("projectListItems", projectListItemss)

        const filteredWeakData: any = [];

        projectListItemss.forEach((item: any) => {
            // Loop through the Weak properties from 1 to 52
            for (let i = 1; i <= 52; i++) {
                const weakKey = `Weak${i}`;
                if (item[weakKey]) {
                    const weakData = JSON.parse(item[weakKey]);
                    if (weakData.Billiability || weakData.Utilization) {
                        filteredWeakData.push(weakData);
                    }
                }
            }
        });
        setHoursTime(filteredWeakData)
        // console.log("filteredWeakData", filteredWeakData);






        // Define your project start date, end date, and working hours per day
        // const startDate = new Date(projectListItemss[0].Project_ID.StartDate);
        // const endDate = new Date(projectListItemss[0].Project_ID.EndDate);
        // const workingHoursPerDay = [filteredWeakData && filteredWeakData[0] && filteredWeakData[0].Billiability === '100' ? '8' : filteredWeakData && filteredWeakData[0] && filteredWeakData[0].Billiability === '50' ? '4' : filteredWeakData && filteredWeakData[0] && filteredWeakData[0].Billiability === '25' ? '2' : ""];

        // Initialize an empty array to store the result
        // const result = [];
        // function convertDateFormat(inputDate: any) {
        //     // Split the input date using "/"
        //     const parts = inputDate.split('/');

        //     // Ensure the parts array has three elements (day, month, year)
        //     if (parts.length === 3) {
        //         // Reorder the date parts and join them with "-"
        //         const formattedDate = `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
        //         return formattedDate;
        //     } else {
        //         // If input format is incorrect, return null or an error message
        //         return null;
        //     }
        // }

        // Loop through the dates between start and end dates
        // let currentDate = startDate;
        // while (currentDate <= endDate) {
        //     // Get the current date in the "DD-MM-YYYY" format
        //     const formattedDate = currentDate.toLocaleDateString('en-GB');

        //     // Get the working hours for the current date
        //     const workingHours = workingHoursPerDay[0]; // Use 0 if no more working hours left

        //     // Create an object for the current date and working hours
        //     const object = { [convertDateFormat(formattedDate)]: { "Coding and Unit Testing": workingHours.toString() } };

        //     // Push the object to the result array
        //     result.push(object);

        //     // Move to the next date
        //     currentDate.setDate(currentDate.getDate() + 1);
        // }
        // Print the result array
        // console.log(result);



        // const groupedByWeek: any = {};

        // Iterate through the original array
        // result.forEach((item: any) => {
        //     const dateStr = Object.keys(item)[0]; // Get the date string, e.g., '25/09/2023'
        //     const dateParts = dateStr.split('-'); // Split the date string into parts
        //     const weekNumber = getWeekNumber(new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`)); // Calculate week number

        //     // If the week number doesn't exist in the groupedByWeek object, create an empty array for it
        //     if (!groupedByWeek[weekNumber]) {
        //         groupedByWeek[weekNumber] = [];
        //     }

        //     // Push the item to the corresponding week number array
        //     groupedByWeek[weekNumber].push(item);
        // });

        // Print the grouped result
        // console.log("week no......",groupedByWeek);

        // Function to get the week number of a date
        // function getWeekNumber(dates: any) {
        //     const date: any = new Date(dates);
        //     const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        //     const dayOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        //     const weekNumber = Math.ceil(dayOfYear / 7);

        //     return weekNumber;
        // }

        // for (let i = 1; i <= 52; i++) {
        //     if (groupedByWeek[i] != undefined) {
        //         console.log("Total array........",groupedByWeek[i])
        //     }
        // }




        // async function submitTimesheet() {
        //         // const date: any = new Date(weekDays[0]);
        //         // const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
        //         // const dayOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
        //         // const weekNumber = Math.ceil(dayOfYear / 7);
        //         // let WeekNo = 'Week' + weekNumber;
        // let items = await _SharepointServiceProxy.getItems({
        //     listName: "Timesheet",
        //     fields: [
        //         "ProjectId/ID",
        //         "ProjectId/ProjectName",
        //         "EmployeeId/Employee_Id",
        //         "EmployeeId/EmpEmail",
        //         "ID",
        //         "TimeSheet",
        //         "WeekNo",
        //         "Status"
        //     ],
        //     expandFields: ["ProjectId", "EmployeeId"],
        //     filter: `EmployeeId/EmpEmail eq '${currentUser?.User?.Email}' and
        //              ProjectId/ID eq '${prjID}'`,
        //     isRoot: true,
        // });
        // }

        // for (let i = 1; i <= 52; i++) {
        //     if (groupedByWeek[i] !== undefined) {
        //         // Construct data object for the current week
        //         const data = {
        //             ProjectIdId: prjID,
        //             "EmployeeIdId": empID,
        //             Status: 'In Process',
        //             WeekNo: 'Week' + i, // Use the current week number from the loop
        //             TimeSheet: JSON.stringify(groupedByWeek[i]) // Convert the array to a JSON string and assign it to TimeSheet
        //         };

        //         // Add data to SharePoint list
        //         try {
        //             if (items.length === 0) {
        //                 let result = await _SharepointServiceProxy.addItem("Timesheet", data, [], true);
        //                 console.log(`Data added for Week ${i + 1}:`, result);
        //                 // alert(`Data added for Week ${i + 1}:`)
        //             }
        //         } catch (error) {
        //             console.error(`Error adding data for Week ${i + 1}:`, error);
        //             alert('ERRR')
        //         }
        //     }
        // }


    }


    // async function submitTimesheet() {
    //     const date: any = new Date(weekDays[0]);
    //     const firstDayOfYear: any = new Date(date.getFullYear(), 0, 1);
    //     const dayOfYear = Math.floor((date - firstDayOfYear) / (24 * 60 * 60 * 1000)) + 1;
    //     const weekNumber = Math.ceil(dayOfYear / 7);
    //     let WeekNo = 'Week' + weekNumber;


    //     let items = await _SharepointServiceProxy.getItems({
    //         listName: "Timesheet",
    //         fields: [
    //             "ProjectId/ID",
    //             "ProjectId/ProjectName",
    //             "EmployeeId/Employee_Id",
    //             "EmployeeId/EmpEmail",
    //             "ID",
    //             "TimeSheet",
    //             "WeekNo",
    //             "Status"
    //         ],
    //         expandFields: ["ProjectId", "EmployeeId"],
    //         filter: `EmployeeId/EmpEmail eq '${userData}' and
    //          ProjectId/ID eq '${selectedProjectID}' and WeekNo eq '${WeekNo}'`,
    //         isRoot: true,
    //     });




    //         const data = {
    //             ProjectId: 2,
    //             EmployeeId: 20011,
    //             Status: 'In Process',
    //             WeekNo: 2,
    //             TimeSheet: "data"
    //         }
    //         let result = await _SharepointServiceProxy.addItem("Timesheet", data, [], true);
    //         console.log(result)

    // }

    return (
        <>
            {openModal === 'Data Saved Successfully' && <AlertBox setModal={setOpenModal} message={"Data Saved Successfully"} showModal={true} alertType={'success'} />}
            {weekValidationMsg === 'Please change or add in input box' && <AlertBox setModal={setWeekValidation} message={"Please change or add hours in input box"} showModal={true} alertType={'warning'} />}
            {submitHours === 'Data Submitted successfully' && <AlertBox setModal={setSubmitHours} message={"Data Submitted successfully"} showModal={true} alertType={'success'} />}
            <div className='body-color'>
                <div className="container-fluid">
                    <div className="main-container">
                        <div className="col-md-12">
                            <div className='row'>
                                <div className="card-body p-2 col-md-6">
                                    <div className="d-flex align-items-center">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="30" fill="currentColor" className="bi bi-hourglass-split" viewBox="0 0 16 16">
                                            <path d="M2.5 15a.5.5 0 1 1 0-1h1v-1a4.5 4.5 0 0 1 2.557-4.06c.29-.139.443-.377.443-.59v-.7c0-.213-.154-.451-.443-.59A4.5 4.5 0 0 1 3.5 3V2h-1a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1h-1v1a4.5 4.5 0 0 1-2.557 4.06c-.29.139-.443.377-.443.59v.7c0 .213.154.451.443.59A4.5 4.5 0 0 1 12.5 13v1h1a.5.5 0 0 1 0 1h-11zm2-13v1c0 .537.12 1.045.337 1.5h6.326c.216-.455.337-.963.337-1.5V2h-7zm3 6.35c0 .701-.478 1.236-1.011 1.492A3.5 3.5 0 0 0 4.5 13s.866-1.299 3-1.48V8.35zm1 0v3.17c2.134.181 3 1.48 3 1.48a3.5 3.5 0 0 0-1.989-3.158C8.978 9.586 8.5 9.052 8.5 8.351z" />
                                        </svg>


                                        <div>
                                            <h4 className="mb-0">User Timesheet</h4>
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
                                                    Time Sheet
                                                </span>{" "}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="row my-2 project-type-ahed">
                                <div className="col-3">
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
                                            onChange={onChangeProjectTypeHead}
                                            onKeyUp={(e: any) => setByProjectData(e.target.value)}
                                        />

                                    </TooltipHost>
                                </div>
                                {showHide === true &&
                                    // <div className="col-md-9 d-flex justify-content-end animation">
                                    //     <p>Please fill the time <span>
                                    //         <b>
                                    //             {hours && hours[0] && hours[0].Billiability === '100' ? '8 Hours/Day' : hours && hours[0] && hours[0].Billiability === '50' ? '4 Hours/Day' : '2 Hours/Day'}
                                    //         </b>
                                    //     </span> for the project <span><b>{ProjectName}</b></span> </p>
                                    // </div>
                                    <div className="col-md-9 d-flex justify-content-end animation">
                                        <p className="animate-text">Please fill the time <span>
                                            <b>
                                                {hours && hours[0] && hours[0].Billiability === '100' ? '8 Hours/Day' : hours && hours[0] && hours[0].Billiability === '50' ? '4 Hours/Day' : hours && hours[0] && hours[0].Billiability === '25' ? '2 Hours/Day' : ""}
                                            </b>
                                        </span> for the project <span><b>{ProjectName}</b></span> </p>
                                    </div>

                                }

                            </div>




                            {showHide === true &&
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-6 pb-3">
                                            {
                                                prevflag === false ?
                                                    <button className="btn btn-outline-primary" onClick={() => { prevWeek(); goToPreviousWeek(); }}>
                                                        <img src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/arrowl.png'} alt="" width={20} /> Previous Week &nbsp;&nbsp;
                                                    </button>
                                                    :
                                                    <button className="btn btn-primary" disabled onClick={prevWeek}>
                                                        Previous Week &nbsp;&nbsp; <img src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/arrowl.png'} alt="" width={20} />
                                                    </button>
                                            }

                                            <button className="btn btn-outline-primary mx-3" onClick={currWeek}>Current Week</button>
                                            {
                                                nexflag === false ?
                                                    <button className={isNextWeekButtonDisabled === false ? "btn btn-outline-primary" : 'd-none'} disabled={isNextWeekButtonDisabled} onClick={() => { nextWeek(); goToNextWeek() }}>
                                                        Next Week &nbsp;&nbsp;<img src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/arrow.png'} alt="" width={20} />
                                                    </button>
                                                    :
                                                    <button className="btn btn-primary" disabled onClick={nextWeek}>
                                                        Next Week &nbsp;&nbsp; <img src={'https://bluebenz0.sharepoint.com/sites/Resource-Management-Dev/Images1/arrow.png'} alt="" width={20} />
                                                    </button>
                                            }

                                        </div>
                                        <div className="align-items-center col-6 d-flex justify-content-end">
                                            <div className='input-skill backColor'></div>
                                            <span className='ms-1 me-2 lable-text'>Holiday</span>
                                        </div>
                                    </div>



                                    <div className="tab-content" id="myTabContent">
                                        <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel"
                                            aria-labelledby="home-tab" tabIndex={0}>







                                            <div className="card shadow">
                                                {/* <div className="card-body"> */}



                                                <div className="table-responsive tableDiv">
                                                    <table className="table table-bordered bg-white tbl-prj">
                                                        <thead>
                                                            <tr className="text-center tab-head">
                                                                <th style={{ width: '240px' }} className='pb-3'>Activities</th>
                                                                <th className='backColor' style={{ backgroundColor: 'antiquewhite' }}>
                                                                    <div>{dateDMY(weekDays[0])}</div>
                                                                    <div>Sun</div>
                                                                </th>
                                                                <th>
                                                                    <div>{dateDMY(weekDays[1])}</div>
                                                                    <div>Mon</div>
                                                                </th>
                                                                <th>
                                                                    <div> {dateDMY(weekDays[2])}</div>
                                                                    <div>Tue</div>
                                                                </th>
                                                                <th>
                                                                    <div> {dateDMY(weekDays[3])}</div>
                                                                    <div>Wed</div>
                                                                </th>
                                                                <th>
                                                                    <div>{dateDMY(weekDays[4])}</div>
                                                                    <div>Thu</div>
                                                                </th>
                                                                <th>
                                                                    <div>{dateDMY(weekDays[5])}</div>
                                                                    <div>Fri</div>
                                                                </th>
                                                                <th className='backColor' style={{ backgroundColor: 'antiquewhite' }}>
                                                                    <div>{dateDMY(weekDays[6])}</div>
                                                                    <div>Sat</div>
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody className="text-center">
                                                            {PaginatedArrTimeSheet && PaginatedArrTimeSheet.map((itr: any, i: any) => {
                                                                // const date = dateDMY(weekDays[i]);

                                                                return (
                                                                    <tr key={i}>
                                                                        <td style={{ borderBottom: '1px solid #dee2e6' }}>{itr.Name}</td>
                                                                        <td>
                                                                            {weekDays[0] === currentWeekDays[0] ? (
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control timesheet-input"
                                                                                    readOnly={disableInput}
                                                                                    // id={`input-${i}-0`}
                                                                                    onChange={(e) => {
                                                                                        timeSheetData(weekDays[0], e.target.value, itr.ID, itr.Name, 0);
                                                                                    }}
                                                                                    defaultValue={parsedData[dateDMY(weekDays[0])]?.[itr.Name] || ""} // Assign the value from the parsed JSON data
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[0])])?.[dateDMY(weekDays[0])][itr.Name] || ""}
                                                                                />
                                                                            ) : (
                                                                                <input type="number" className="form-control" disabled
                                                                                    defaultValue={parsedData[dateDMY(weekDays[0])]?.[itr.Name] || ""}
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[0])])?.[dateDMY(weekDays[0])][itr.Name] || ""}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {weekDays[1] === currentWeekDays[1] ? (
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control timesheet-input"
                                                                                    readOnly={disableInput}
                                                                                    // id={`input-${i}-0`}
                                                                                    onChange={(e) => {
                                                                                        timeSheetData(weekDays[1], e.target.value, itr.ID, itr.Name, 0);
                                                                                    }}
                                                                                    defaultValue={parsedData[dateDMY(weekDays[1])]?.[itr.Name] || ""} // Assign the value from the parsed JSON data
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[1])])?.[dateDMY(weekDays[1])][itr.Name] || ""}
                                                                                />
                                                                            ) : (
                                                                                <input type="number" className="form-control" disabled
                                                                                    defaultValue={parsedData[dateDMY(weekDays[1])]?.[itr.Name] || ""}
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[1])])?.[dateDMY(weekDays[1])][itr.Name] || ""}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {weekDays[2] === currentWeekDays[2] ? (
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control timesheet-input"
                                                                                    readOnly={disableInput}
                                                                                    // id={`input-${i}-0`}
                                                                                    onChange={(e) => {
                                                                                        timeSheetData(weekDays[2], e.target.value, itr.ID, itr.Name, 0);
                                                                                    }}
                                                                                    defaultValue={parsedData[dateDMY(weekDays[2])]?.[itr.Name] || ""} // Assign the value from the parsed JSON data
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[2])])?.[dateDMY(weekDays[2])][itr.Name] || ""}
                                                                                />
                                                                            ) : (
                                                                                <input type="number" className="form-control" disabled
                                                                                    defaultValue={parsedData[dateDMY(weekDays[2])]?.[itr.Name] || ""}
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[2])])?.[dateDMY(weekDays[2])][itr.Name] || ""}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {weekDays[3] === currentWeekDays[3] ? (
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control timesheet-input"
                                                                                    readOnly={disableInput}
                                                                                    // id={`input-${i}-0`}
                                                                                    onChange={(e) => {
                                                                                        timeSheetData(weekDays[3], e.target.value, itr.ID, itr.Name, 0);
                                                                                    }}
                                                                                    defaultValue={parsedData[dateDMY(weekDays[3])]?.[itr.Name] || ""} // Assign the value from the parsed JSON data
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[3])])?.[dateDMY(weekDays[3])][itr.Name] || ""}
                                                                                />
                                                                            ) : (
                                                                                <input type="number" className="form-control" disabled
                                                                                    defaultValue={parsedData[dateDMY(weekDays[3])]?.[itr.Name] || ""}
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[3])])?.[dateDMY(weekDays[3])][itr.Name] || ""}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {weekDays[4] === currentWeekDays[4] ? (
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control timesheet-input"
                                                                                    readOnly={disableInput}
                                                                                    // id={`input-${i}-0`}
                                                                                    onChange={(e) => {
                                                                                        timeSheetData(weekDays[4], e.target.value, itr.ID, itr.Name, 0);
                                                                                    }}
                                                                                    defaultValue={parsedData[dateDMY(weekDays[4])]?.[itr.Name] || ""} // Assign the value from the parsed JSON data
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[4])])?.[dateDMY(weekDays[4])][itr.Name] || ""}
                                                                                />
                                                                            ) : (
                                                                                <input type="number" className="form-control" disabled
                                                                                    defaultValue={parsedData[dateDMY(weekDays[4])]?.[itr.Name] || ""}
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[4])])?.[dateDMY(weekDays[4])][itr.Name] || ""}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {weekDays[5] === currentWeekDays[5] ? (
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control timesheet-input"
                                                                                    readOnly={disableInput}
                                                                                    // id={`input-${i}-0`}
                                                                                    onChange={(e) => {
                                                                                        timeSheetData(weekDays[5], e.target.value, itr.ID, itr.Name, 0);
                                                                                    }}
                                                                                    defaultValue={parsedData[dateDMY(weekDays[5])]?.[itr.Name] || ""} // Assign the value from the parsed JSON data
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[5])])?.[dateDMY(weekDays[5])][itr.Name] || ""}
                                                                                />
                                                                            ) : (
                                                                                <input type="number" className="form-control" disabled
                                                                                    defaultValue={parsedData[dateDMY(weekDays[5])]?.[itr.Name] || ""}
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[5])])?.[dateDMY(weekDays[5])][itr.Name] || ""}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {weekDays[6] === currentWeekDays[6] ? (
                                                                                <input
                                                                                    type="number"
                                                                                    className="form-control timesheet-input"
                                                                                    readOnly={disableInput}
                                                                                    // id={`input-${i}-0`}
                                                                                    onChange={(e) => {
                                                                                        timeSheetData(weekDays[6], e.target.value, itr.ID, itr.Name, 0);
                                                                                    }}
                                                                                    defaultValue={parsedData[dateDMY(weekDays[6])]?.[itr.Name] || ""} // Assign the value from the parsed JSON data
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[0])])?.[dateDMY(weekDays[0])][itr.Name] || ""}
                                                                                />
                                                                            ) : (
                                                                                <input type="number" className="form-control" disabled
                                                                                    defaultValue={parsedData[dateDMY(weekDays[6])]?.[itr.Name] || ""}
                                                                                // defaultValue={parsedData.find((obj:any) => obj[dateDMY(weekDays[6])])?.[dateDMY(weekDays[6])][itr.Name] || ""}
                                                                                />
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                        <tbody className="text-center">
                                                            <tr>
                                                                <td>Total hours per day</td>
                                                                <td>{sumPerDate[dateDMY(weekDays[0])]}</td>
                                                                <td>{sumPerDate[dateDMY(weekDays[1])]}</td>
                                                                <td>{sumPerDate[dateDMY(weekDays[2])]}</td>
                                                                <td>{sumPerDate[dateDMY(weekDays[3])]}</td>
                                                                <td>{sumPerDate[dateDMY(weekDays[4])]}</td>
                                                                <td>{sumPerDate[dateDMY(weekDays[5])]}</td>
                                                                <td>{sumPerDate[dateDMY(weekDays[6])]}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* </div> */}
                                            </div>
                                            <div className="table-responsive ">
                                                <table className='d-flex justify-content-center mt-2'>
                                                    <thead>
                                                        <tr className='text-center tab-head'>
                                                            <th>
                                                                <div className="">
                                                                    <button className='btn btn-primary' onClick={() => saveInProcessTimesheet()}>Save</button>
                                                                    <button disabled={disableInput} className='ms-1 btn btn-primary' onClick={() => submitTimesheet()}>Submit</button>
                                                                    {/* <button className='ms-1 btn btn-primary' onClick={() => EditTimesheet()}>Edit</button> */}
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                            </div>

                                            <Pagination
                                                orgData={data}
                                                setNewFilterarr={setPaginatedArrTimeSheet}
                                            />

                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                        {/* </div> */}
                    </div>
                </div>
            </div>


        </>
    )
}

export default Timesheetuser