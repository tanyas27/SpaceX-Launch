import React, { useEffect, useState } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { used } from '@amcharts/amcharts4/.internal/core/utils/Utils';
import './LaunchesChart.css';
import axios from 'axios';

am4core.useTheme(am4themes_animated);

function LaunchesChart (props) {
    const [status, setStatus] = useState({
        success: 0,
        failed:0,
        upcoming:0,
        total:0,
        show: false
    });
    useEffect(()=>{
        axios.all([
            axios.get('https://api.spacexdata.com/v3/launches/past?launch_success=true'),
            axios.get('https://api.spacexdata.com/v3/launches/past?launch_success=false'),
            axios.get('https://api.spacexdata.com/v3/launches/upcoming')
        ])
        .then(axios.spread((...res) => {
            setStatus({
                success: res[0].data.length,
                failed:res[1].data.length,
                upcoming:res[2].data.length,
                total:res[0].data.length + res[1].data.length + res[2].data.length,
                show: true
            }); 
            renderData();
        }
        ));   
    },[status.show]);

    const renderData = () => {
        
        var chart = am4core.create("chartdiv", am4charts.PieChart);
        chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

        chart.data = [
            {
                status: "Upcoming",
                value: status.upcoming/ status.total
            },   
            {
                status: "Success",
                value: status.success/ status.total
            },
            {
                status: "Failed",
                value: status.failed/ status.total
            }
        ];
        chart.radius = am4core.percent(70);
        chart.innerRadius = am4core.percent(40);
        chart.startAngle = 180;
        chart.endAngle = 360;  

        var series = chart.series.push(new am4charts.PieSeries());
        series.dataFields.value = "value";
        series.dataFields.category = "status";

        series.slices.template.cornerRadius = 6;
        series.slices.template.innerCornerRadius = 7;
        series.slices.template.draggable = true;
        series.slices.template.inert = true;

        series.hiddenState.properties.startAngle = 90;
        series.hiddenState.properties.endAngle = 90;

        chart.legend = new am4charts.Legend();
        
    }

    return (
    <div id="launch-chart">
        <div id="chartdiv"></div> 
    </div>);
}

export default React.memo(LaunchesChart);