import React from 'react';
import './LaunchDetails.css';
import Modal from '../../UI/Modal/Modal';
import Nasa from '../../images/image2.png';
import Wiki from '../../images/image 3.png';
import VideoImg from '../../images/image 4.png';

const launchDetails = (props) => {
    const data = props.details[0];
    let style = (data.status === 'Upcoming') ? 'yellow' : (data.status === 'Success') ? 'green' : 'red';
    return (
        <div className="LaunchDetails">
            <Modal show modalClosed={props.modalClosed}>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.modalClosed}>
                <span aria-hidden="true">&times;</span>
            </button>
            <div className="modal-head">
                <img id="logo" src={data.img} alt="logo"/>
                <div>
                    <div>{data.mission} <small className="badge badge-pill" id={style}> {data.status}</small></div>
                    <small>{data.rocket_name}</small><br/>
                    <a href={data.nasa}><img src={Nasa} alt="nasa"/></a>
                    <a href={data.wikipedia}><img src={Wiki} alt="wiki"/></a>
                    <a href={data.video}><img src={VideoImg} alt="video"/></a>   
                </div>
            </div>
            <div>
                {data.description}
                <a href={data.wikipedia}> Wikipedia</a> 
            </div>
            <table className="table">
                <tbody>
                    <tr>
                        <td>Flight Number</td>
                        <td>{data.flightNo}</td>
                    </tr>
                    <tr>
                        <td>Mission Name</td>
                        <td>{data.mission}</td>
                    </tr>
                    <tr>
                        <td>Rocket Type</td>
                        <td>{data.rocket_type}</td>
                    </tr>
                    <tr>
                        <td>Rocket Name</td>
                        <td>{data.rocket_name}</td>
                    </tr>
                    <tr>
                        <td>Manufacturer</td>
                        <td>{data.manufacturer}</td>
                    </tr>
                    <tr>
                        <td>Nationality</td>
                        <td>{data.nationality}</td>
                    </tr>
                    <tr>
                        <td>Launch Date</td>
                        <td>{data.launchDate}</td>
                    </tr>
                    <tr>
                        <td>Payload Type</td>
                        <td>{data.payload_type}</td>
                    </tr>
                    <tr>
                        <td>Orbit</td>
                        <td>{data.orbit}</td>
                    </tr>
                    <tr>
                        <td>Launch Site</td>
                        <td>{data.launchSite}</td>
                    </tr>
                </tbody>    
            </table>
            </Modal>
        </div>
    );
};


export default launchDetails;