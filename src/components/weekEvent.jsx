import React, { Component } from 'react';
import { BiCheck, BiX } from 'react-icons/bi';

class WeekEvent extends Component {
    state = {}
    catcolors = ["#ffd4d4", "#ffe6d4", "#fffbd4", "#e2ffd4", "#d4ffec", "#d4f6ff", "#d4dfff", "#f0d4ff", "#ffd4ee"]
    darkcatcolors = ["#cf4c4c", "#de813e", "#9e8600", "#54b027", "#2fa36f", "#3aa0bd", "#4d6fd6", "#9c52c4", "#bf5a97"]

    constructor(props) {
        super(props);

        this.state = { windowWidth: window.innerWidth, viewState: "normal" };

        this.eventBox = React.createRef()   // reference for hidden event details pop-up
        this.editBox = React.createRef()    // reference for hidden event edit pop-up
    }

    handleResize = (e) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    // if in edit mode, will not toggle details box
    _toggleEventBox(event) {
        if (this.state.viewState != "edit") {
            if (this.state.viewState === "normal") {
                this.eventBox.current.className = "box";
                this.state.viewState = "details";
            } else {
                this.eventBox.current.className = "is-hidden box";
                this.state.viewState = "normal";
            }
        }

    }

    _editMode(event) {
        this.state.viewState = "edit";

        this.eventBox.current.className = "is-hidden box"
        this.editBox.current.className = "box"
    }

    _getEventLength() {
        let ending = this.props.eventstate.end + (this.props.eventstate.emin / 60)
        let starting = this.props.eventstate.start + (this.props.eventstate.smin / 60)
        return ending - starting
    }


    _createEventBox() {
        let depth = `${(this._getEventLength()) * 80 - 20}px`
        let marg = this.props.eventstate.day === 6 ? `60px 0px -50px 0px` : `60px 0px 0px 50px`;

        const event_style = {
            width: "200px",
            position: "absolute",
            height: "200px",
            margin: `${marg}`,
            zIndex: "1",
            padding: "10px"
        }
        return (
            <div ref={this.eventBox} className="is-hidden box" style={event_style}>
                <p className="has-text-left has-text-weight-semibold" style={{ fontSize: "15px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this.props.eventstate.name}</p>
                <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this._findHour(this.props.eventstate.start)} - {this._findHour(this.props.eventstate.end)}</p>
                <hr className="hr" style={{ margin: "2px" }}></hr>
                <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this.props.eventstate.location}</p>
                <hr className="hr" style={{ margin: "2px" }}></hr>
                <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this.props.eventstate.description}</p>
            </div>

        )
    }

    _createEditBox() {
        let depth = `${(this._getEventLength()) * 80 - 20}px`
        let marg = this.props.eventstate.day === 6 ? `60px 0px -50px 0px` : `60px 0px 0px 50px`;

        const event_style = {
            width: "200px",
            position: "absolute",
            margin: `${marg}`,
            zIndex: "1",
            padding: "10px"
        }
        return (
            <div ref={this.editBox} className="is-hidden box" style={event_style}>
                <form>

                    <input className="input" defaultValue={`${this.props.eventstate.name}`} type="text" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}></input>
                    <hr className="hr" style={{ margin: "2px" }}></hr>
                    <input className="input" defaultValue={`${this.props.eventstate.location}`} type="text" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}></input>
                    <hr className="hr" style={{ margin: "2px" }}></hr>
                    <textarea className="input" type="text" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{`${this.props.eventstate.location}`}</textarea>
                    <hr className="hr" style={{ margin: "2px" }}></hr>
                    <textarea className="input" type="text" style={{ fontSize: "13px", height: "75px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{`${this.props.eventstate.description}`}</textarea>
                    <hr className="hr" style={{ margin: "2px" }}></hr>
                    <input className="input" type="time" style={{ height: "30px", color: this.darkcatcolors[this.props.eventstate.category % 9] }} />
                    <hr className="hr" style={{ margin: "2px" }}></hr>
                    <input className="input" type="time" style={{ height: "30px", color: this.darkcatcolors[this.props.eventstate.category % 9] }} />
                    <hr className="hr" style={{ margin: "2px" }}></hr>
                    <button className="button" style={{ fontSize: "10px" }}><BiCheck /></button>
                    <button className="button" style={{ fontSize: "10px" }}><BiX /></button>
                </form>
            </div>
        )
    }

    _findHour(time) {
        if (time < 12) { return time === 0 ? "12 AM" : time + " AM" }
        else { return (time % 12) === 0 ? "12 PM" : (time % 12) + " PM" }

    }

    render() {
        const event_style = {
            width: `${(this.state.windowWidth - 250) / 8}px`,
            position: "absolute",
            height: `${(this._getEventLength()) * 80}px`,
            backgroundColor: this.catcolors[this.props.eventstate.category % 9],
            margin: `${(this.props.eventstate.smin / 60) * 80}px 0px 0px 0px`,
            padding: "10px"
        }

        return (
            <div>
                <div style={event_style} className="box week-event" onMouseEnter={this._toggleEventBox.bind(this)} onMouseLeave={this._toggleEventBox.bind(this)} onDoubleClick={this._editMode.bind(this)}>
                    <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this._findHour(this.props.eventstate.start)} - {this._findHour(this.props.eventstate.end)}</p>
                    <p className="has-text-left has-text-weight-semibold" style={{ fontSize: "15px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this.props.eventstate.name}</p>
                </div>
                { this._createEventBox()}
                {this._createEditBox()}
            </div >


        )
    }
}

export default WeekEvent;