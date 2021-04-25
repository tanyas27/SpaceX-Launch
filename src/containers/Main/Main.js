import React, { useState, useEffect, useRef } from 'react';
import { withRouter } from "react-router-dom";
import axios from '../../axios';
import date from 'date-and-time';
import Table from '../../components/Table/Table';
import DateRange from  '../../UI/DateRange/DateRange';
import './Main.css';
import LaunchDetails from '../../components/LaunchDetails/LaunchDetails';
import {getParams, setParams} from '../../QueryParams';
import LaunchesChart from '../LaunchesChart/LaunchesChart';
import Countdown from '../../UI/Countdown/Countdown';

function Main(props) {
  const [activePage, setActivePage] = useState(1);
  const [launchStatus, setLaunchStatus] = useState();
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [launchData, setLaunchData] = useState();
  const [showDateModal, setShowDateModal] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [label, setLabel] = useState("All Time");
  const [nextLaunch, setNextLaunch] = useState({
    name: "",
    date: ""
  });

  const didMountRef = useRef(false);
  
  const resetAll = () => {
    setActivePage(1);
    setLaunchStatus(null);
    setStartDate(null);
    setEndDate(null);
    setLabel("All Time");
    props.history.push(``);
  }

  const setTableRows = (responseData) => {
    let tempObj = null;
    let counter = 1;
    let newTableData = [];
    for(let x of responseData){
      let style = "";
      if(x.status === "Upcoming"){
        style+= "yellow";
      }
      else if(x.status === "Success"){
        style+= "green";
      }
      else{
        style+= "red";
      }

      tempObj = (
      <tr key={(x.flight_num !== 110) ? x.flight_num : x.flight_num+"_"+counter} onClick={() => showLaunchDetails(x.flight_num)}>
        <td>{(counter < 10)? '0'+counter++: counter++}</td>
        <td>{x.launchDate}</td>
        <td>{x.launchSite}</td>
        <td>{x.mission}</td>
        <td>{x.orbit}</td>      
        <td><span className="badge badge-pill" id={style}>{x.status}</span></td> 
        <td>{x.rocket}</td>      
      </tr> );        
      newTableData.push(tempObj);
      tempObj = null;
    }
    setLoading(false);
    setTableData(newTableData);
  }

  const storeData = (response) => {
    let tempObj = null;
    let tempData = [];
    for(let a of response){
      tempObj = {
        flight_num: a.flight_number,
        launchDate: date.format(new Date(a.launch_date_utc), 'DD MMMM YYYY HH:mm'),
        launchSite: a.launch_site.site_name,
        mission: a.mission_name,
        orbit: a.rocket.second_stage.payloads[0].orbit,
        status: (a.upcoming) ? 'Upcoming' : (a.launch_success) ? 'Success' : 'Failed',
        rocket: a.rocket.rocket_name
      };             
      tempData.push(tempObj);
      tempObj = null;
    }    
    setTableRows(tempData);   
  }

  const fetchData = () => {
    let dateRange = (!startDate) ? "" : `start=${startDate}&end=${endDate}`; 
    setTableData([]);
    setLoading(true);
    if(launchStatus || startDate){
      let url = setParams({status: launchStatus, start: startDate, end: endDate, label: label});
      props.history.push(`?${url}`);
    }

    axios.get('https://api.spacexdata.com/v4/launches/next').then( res => {
      setNextLaunch({
        name: res.data.name,
        date: date.format(new Date(res.data.date_utc), 'MM DD YYYY, h:mm am')
      });
    });
    
    switch(launchStatus){
      case "Upcoming": {
        axios.get(`/upcoming?offset=${(activePage-1)*10}&${dateRange}&limit=10`)
        .then(response => { 
          storeData(response.data);   
        })
        .catch( (error) => {
          alert("oh snap! Something went wrong");
        });
        break;       
      }
      case "Success": {
        axios.get(`/past?launch_success=true&offset=${(activePage-1)*10}&${dateRange}&limit=10`)
        .then(response => { 
          storeData(response.data);   
        })
        .catch( (error) => {
          alert("oh snap! Something went wrong");
        });
        break; 
      }
      case "Failed": {
        axios.get(`/past?launch_success=false&offset=${(activePage-1)*10}&${dateRange}&limit=10`)
        .then(response => { 
          storeData(response.data);   
        })
        .catch( (error) => {
          alert("oh snap! Something went wrong");
        });
        break;
      }
      default:  {
        axios.get(`?offset=${(activePage-1)*10}&${dateRange}&limit=10`)
        .then(response => { 
          storeData(response.data);            
        })
        .catch( (error) => {
          alert("oh snap! Something went wrong");
        }); 
      }  
    } 
  } 

  useEffect( () => {
    if(!didMountRef.current){
      if(props.location.search){      
        let initialValues = getParams(props.location);
        setLaunchStatus(initialValues.status);
        if(initialValues.start){
          setStartDate(initialValues.start);
          setEndDate(initialValues.end);
          if(initialValues.label){
            setLabel(initialValues.label);
          }
        }   
      }
      else{
        fetchData();
      }
      didMountRef.current = true;
    }  
    else{
      fetchData();
    }
    },[activePage, launchStatus, startDate, endDate]);

  const changePage = (pageNumber) => {
    setActivePage(pageNumber);
  }

  const showLaunchDetails = (flightNo) => {
    setShowModal(true);
    axios.get(`/${flightNo}`)
    .then(response => { 
      let x = response.data;
      let tempLaunchData = [{
        description: x.details,
        rocket_name: x.rocket.rocket_name,
        rocket_type: x.rocket.rocket_type,  
        img:x.links.mission_patch_small,      
        nasa: x.links.article_link,
        wikipedia: x.links.wikipedia,
        video: x.links.video_link,        
        flightNo: x.flight_number,
        mission: x.mission_name,
        manufacturer: x.rocket.second_stage.payloads[0].manufacturer,
        nationality: x.rocket.second_stage.payloads[0].nationality,
        payload_type:x.rocket.second_stage.payloads[0].payload_type,
        launchDate: date.format(new Date(x.launch_date_utc), 'DD MMMM YYYY HH:mm'),
        launchSite: x.launch_site.site_name,
        orbit: x.rocket.second_stage.payloads[0].orbit,
        status: (x.upcoming) ? 'Upcoming' : (x.launch_success) ? 'Success' : 'Failed'
      }];
      setLaunchData(tempLaunchData);
    })
    .catch( (error) => {
      alert("oh snap! Something went wrong");
    }); 
  }

  const handleLaunchStatus = (status) => {
    setLaunchStatus(status);   
    setActivePage(1);
  }

  const handleDateChange = (val) => {
    if(val.dateRange[1] != null){
    setShowDateModal(false);
    setActivePage(1);
    let dates = val.dateRange;
    setStartDate(dates[0].toLocaleDateString('en-CA'));
    setEndDate(dates[1].toLocaleDateString('en-CA'));
    setLabel(val.label);
    }
  }
  
  return (
    <div className="Main">
      <div className="dropdown">
        <button className="btn btn-light dropdown-toggle" type="button" id="btn1" onClick={()=>setShowDateModal(!showDateModal)}>
         <i className="bi bi-calendar4"></i>
         {" "+label}
        </button>
        {(showDateModal) ? <DateRange closeModal={()=>setShowDateModal(!showDateModal)} dateChange={handleDateChange}/> : null}
      </div>
      <button className="btn btn-light" id="btn3" onClick={resetAll} style={{display: (launchStatus || startDate ) ? "block" : "none" }}>Clear All Filter <i className="bi bi-x-circle"></i></button>
      <div className="dropdown">
        <button className="btn btn-light dropdown-toggle" type="button" id="btn2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="bi bi-funnel"></i>
          {(launchStatus) ? " " + launchStatus : "All Launches"}
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" onClick={() => handleLaunchStatus("All Launches")} href="#">All Launches</a>
          <a className="dropdown-item" onClick={() => handleLaunchStatus("Upcoming")} href="#">Upcoming Launches</a>
          <a className="dropdown-item" onClick={() => handleLaunchStatus("Success")} href="#">Successfull Launches</a>
          <a className="dropdown-item" onClick={() => handleLaunchStatus("Failed")} href="#">Failed Launches</a>
        </div>
     </div>  
     <div id="main-content">
      <div className="side">
        <Countdown
          timeTillDate={nextLaunch.date}
          timeFormat="MM DD YYYY, h:mm a"
          name={nextLaunch.name}
        />
        <LaunchesChart/>  
      </div>
      <Table loading={loading} 
        activePage={activePage}
        changePage={changePage}
      >
       {tableData}
      </Table>
      </div>    
      <footer></footer>
      {(showModal&&launchData) ? <LaunchDetails modalClosed={()=>setShowModal(!showModal)} details={launchData}/> : null}
    </div>
  );
}

export default withRouter(Main);
