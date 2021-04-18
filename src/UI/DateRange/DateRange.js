import React from 'react';
import Modal from '../Modal/Modal';

import { DateRangePicker } from "@blueprintjs/datetime";
import { Classes, H5, HTMLSelect } from "@blueprintjs/core";
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import "normalize.css/normalize.css"; 
import "@blueprintjs/icons/lib/css/blueprint-icons.css"; 
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";

const dateRange = (props) => {
    return (
        <Modal show modalClosed={props.closeModal}>
        <DateRangePicker        
            allowSingleDayRange= {false}
            contiguousCalendarMonths= {true}
            dateRange= {[null,null]}
            selectedShortcutIndex
            reverseMonthAndYearMenus= {false}
            shortcuts= {true}
            singleMonthOnly= {false}
            maxDateIndex= {0}
            minDateIndex= {0}
            className={Classes.ELEVATION_1}    
            onChange={(DateRange) => props.dateChange({dateRange:DateRange, label:"All Time"})}
            onShortcutChange= {(val)=> props.dateChange(val)}
        /></Modal>
    );
}

export default dateRange;