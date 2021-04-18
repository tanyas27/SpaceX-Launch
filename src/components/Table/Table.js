import React from 'react';
import FadeLoader from "react-spinners/FadeLoader";
import Pagination from "react-js-pagination";
import './Table.css';

function Table(props){
    return(
      <div className="ContentTable">        
        <table className="table table-responsive-md">
          <thead>
            <tr>
              <th scope="col">No:</th>
              <th scope="col">Launched (UTC)</th>
              <th scope="col">Location</th>
              <th scope="col">Mission</th>
              <th scope="col">Orbit</th>
              <th scope="col">Launch Status</th>
              <th scope="col">Rocket</th>
            </tr>
          </thead>
          <tbody>
          {(props.loading) ?
          <tr><td id="spinner" colSpan="7"><FadeLoader color={"#E4E4E7"} width={8} radius={15} margin={10} height={18} /></td></tr> :
          (props.children.length)? props.children: <tr><th id="emptyMsg" colSpan="7">No results found for the specified filter</th></tr>
          }
          </tbody>
        </table>
        <Pagination
          activePage={props.activePage}
          itemsCountPerPage={12}
          totalItemsCount={111}
          pageRangeDisplayed={5}
          hideFirstLastPages
          onChange={props.changePage}
          itemClass="page-item"
          linkClass="page-link"
        />
      </div>
    );
}

export default React.memo(Table);