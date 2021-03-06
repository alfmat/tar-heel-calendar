import React, { Component } from 'react';
import { BiCheck, BiX } from 'react-icons/bi';
import axios from '../../node_modules/axios/index.js';

class DayEvent extends Component {
    state = {}
    catcolors = ["#ffd4d4", "#ffe6d4", "#fffbd4", "#e2ffd4", "#d4ffec", "#d4f6ff", "#d4dfff", "#f0d4ff", "#ffd4ee"]
    darkcatcolors = ["#cf4c4c", "#de813e", "#9e8600", "#54b027", "#2fa36f", "#3aa0bd", "#4d6fd6", "#9c52c4", "#bf5a97"]

    constructor(props) {
        super(props);

        this.state = {
            eventstate: this.props.eventstate,
            windowWidth: window.innerWidth,
            loggedIn: this._getCookie("token").length === 60,
            showEvent: true
        };

        this.eventBox = React.createRef()
        this.formFields = { name: React.createRef(), location: React.createRef(), description: React.createRef(), date: React.createRef(), start: React.createRef(), end: React.createRef() }
    }

    handleResize = (e) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    _getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        else return ""

    }


    _toggleEventBox(event) {
        // I think we may just want to display all event info on a day event since it is pretty big?

        if (this.eventBox.current.className === "is-hidden box") {
            this.eventBox.current.className = "box";
        } else {
            this.eventBox.current.className = "is-hidden box";
        }
    }

    deleteEdit(event) {
        this._toggleEventBox(event)

    }

    async submitEdit(event) {
        this._toggleEventBox(event)
        let name = this.formFields.name.current.value
        let loc = this.formFields.location.current.value
        let des = this.formFields.description.current.value
        let date = this.formFields.date.current.value
        let start = this.formFields.start.current.value
        let end = this.formFields.end.current.value

        let startdate = date + " " + start + ":00"
        let enddate = date + " " + end + ":00"

        if (this.state.loggedIn) {
            const results = await axios({
                method: 'post',
                url: 'https://tar-heel-calendar.herokuapp.com/editevent',
                data: {
                    token: this._getCookie("token"),
                    id: this.state.eventstate.id,
                    title: name,
                    location: loc,
                    description: des,
                    start: startdate,
                    end: enddate,
                    category: this.state.eventstate.category
                }
            });

            if (results.data.message === "Event edited.") {
                this.setState({
                    eventstate: {
                        id: this.state.eventstate.id,
                        date: date,
                        start: parseFloat(start.split(":")[0]),
                        smin: parseFloat(start.split(":")[1]),
                        end: parseFloat(end.split(":")[0]),
                        emin: parseFloat(end.split(":")[1]),
                        name: name,
                        location: loc,
                        description: des,
                        category: this.state.eventstate.category
                    }
                })
            }
        }
    }

    async _submitDelete() {

        if (this.state.loggedIn) {
            const results = await axios({
                method: 'delete',
                url: 'https://tar-heel-calendar.herokuapp.com/deleteevent',
                data: {
                    token: this._getCookie("token"),
                    id: this.state.eventstate.id
                }
            });

            if (results.data.message === "Deleted event.") {
                this.setState({ showEvent: !this.state.showEvent })
            }
        }

    }

    _getTime(hour, mins) {
        if (hour < 10) {
            hour = "0" + hour
        }
        if (mins < 10) {
            mins = "0" + mins
        }
        return hour + ":" + mins
    }


    _createEventBox() {
        const event_style = {
            width: `${(this.state.windowWidth / 2.5)}px`,
            position: "absolute",
            height: `${(this._getEventLength()) * 80}px`,
            backgroundColor: this.catcolors[this.state.eventstate.category % 9],
            margin: `${(this.state.eventstate.smin / 60) * 80}px 0px 0px 0px`,
            zIndex: "1",
            overflow: "scroll"
        }

        let defaultstart = this._getTime(this.state.eventstate.start, this.state.eventstate.smin)
        let defaultend = this._getTime(this.state.eventstate.end, this.state.eventstate.emin)

        return (
            <div ref={this.eventBox} className="is-hidden box" style={event_style}>
                <div className="level">
                    <div className="level-left">
                        <input className="input" ref={this.formFields.name} defaultValue={`${this.state.eventstate.name}`} type="text" style={{ fontSize: "15px", fontWeight: "bolder", color: this.darkcatcolors[this.state.eventstate.category % 9], backgroundColor: this.catcolors[this.state.eventstate.category % 9] }}></input>
                    </div>
                    <div className="level-right">
                        <button className="button" style={{ fontSize: "10px" }} onClick={this.submitEdit.bind(this)}><BiCheck /></button>
                        <button className="button" style={{ fontSize: "10px" }} onClick={this.deleteEdit.bind(this)}><BiX /></button>

                    </div>
                </div>
                <hr className="hr" style={{ margin: "4px" }}></hr>
                <input className="input" ref={this.formFields.location} defaultValue={`${this.state.eventstate.location}`} type="text" style={{ fontSize: "13px", color: this.darkcatcolors[this.state.eventstate.category % 9], backgroundColor: this.catcolors[this.state.eventstate.category % 9] }}></input>
                <hr className="hr" style={{ margin: "4px" }}></hr>
                <textarea className="input" ref={this.formFields.description} defaultValue={`${this.state.eventstate.description}`} type="text" style={{ height: "75px", fontSize: "13px", color: this.darkcatcolors[this.state.eventstate.category % 9], backgroundColor: this.catcolors[this.state.eventstate.category % 9] }}></textarea>
                <hr className="hr" style={{ margin: "4px" }}></hr>
                <input className="input" ref={this.formFields.date} defaultValue={`${this.state.eventstate.date}`} type="date" style={{ height: "30px", color: this.darkcatcolors[this.state.eventstate.category % 9], backgroundColor: this.catcolors[this.state.eventstate.category % 9] }} />
                <hr className="hr" style={{ margin: "2px" }}></hr>
                <input className="input" ref={this.formFields.start} type="time" defaultValue={`${defaultstart}`} style={{ height: "30px", color: this.darkcatcolors[this.state.eventstate.category % 9], backgroundColor: this.catcolors[this.state.eventstate.category % 9] }} />
                <hr className="hr" style={{ margin: "2px" }}></hr>
                <input className="input" ref={this.formFields.end} type="time" defaultValue={`${defaultend}`} style={{ height: "30px", color: this.darkcatcolors[this.state.eventstate.category % 9], backgroundColor: this.catcolors[this.state.eventstate.category % 9] }} />

            </div>

        )
    }

    _getEventLength() {
        let start = this.props.eventstate.start
        let end = this.props.eventstate.end

        let ending = end + (this.props.eventstate.emin / 60)
        let starting = start + (this.props.eventstate.smin / 60)
        return ending - starting
    }

    _findHour(hour, minutes) {
        if (hour < 12) {
            if (hour === 0) {
                return minutes === 0 ? "12 AM" : `12:${minutes < 10 ? `0${minutes}` : minutes} AM`
            } else {
                return minutes === 0 ? `${hour} AM` : `${hour}:${minutes < 10 ? `0${minutes}` : minutes} AM`
            }
        } else {
            if (hour % 12 === 0) {
                return minutes === 0 ? "12 PM" : `12:${minutes < 10 ? `0${minutes}` : minutes} PM`
            } else {
                return minutes === 0 ? `${hour % 12} PM` : `${hour % 12}:${minutes < 10 ? `0${minutes}` : minutes} PM`
            }

        }
    }


    render() {
        const event_style = {
            width: `${(this.state.windowWidth / 2.5)}px`,
            position: "absolute",
            height: `${(this._getEventLength()) * 80}px`,
            backgroundColor: this.catcolors[this.state.eventstate.category % 9],
            margin: `${(this.state.eventstate.smin / 60) * 80}px 0px 0px 0px`,
            overflow: "scroll"
        }

        if (this.state.showEvent) {
            return (
                <div>
                    <div style={event_style} className="box" onDoubleClick={this._toggleEventBox.bind(this)}>
                        <div className="level">
                            <div className="level-left">
                                <p className="has-text-left has-text-weight-semibold" style={{ fontSize: "15px", color: this.darkcatcolors[this.state.eventstate.category % 9] }}>{this.state.eventstate.name}</p>
                            </div>
                            <div className="level-right">
                                <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.state.eventstate.category % 9] }}>{this._findHour(this.state.eventstate.start, this.state.eventstate.smin)} - {this._findHour(this.state.eventstate.end, this.state.eventstate.emin)}</p>
                                <a style={{ float: "right", margin: "0px 5px" }} onClick={this._submitDelete.bind(this)} class="delete is-small"></a>
                            </div>
                        </div>
                        <hr className="hr" style={{ margin: "4px" }}></hr>
                        <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.state.eventstate.category % 9] }}>{this.state.eventstate.location}</p>
                        <hr className="hr" style={{ margin: "4px" }}></hr>
                        <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.state.eventstate.category % 9] }}>{this.state.eventstate.description}</p>

                    </div>
                    {this._createEventBox()}
                </div>)
        } else {
            return (
                <div></div>
            )
        }






    }
}

export default DayEvent;