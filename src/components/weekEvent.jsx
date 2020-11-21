import React, { Component } from 'react';

class WeekEvent extends Component {
    state = {}
    catcolors = ["#ffd4d4", "#ffe6d4", "#fffbd4", "#e2ffd4", "#d4ffec", "#d4f6ff", "#d4dfff", "#f0d4ff", "#ffd4ee"]
    darkcatcolors = ["#cf4c4c", "#de813e", "#9e8600", "#54b027", "#2fa36f", "#3aa0bd", "#4d6fd6", "#9c52c4", "#bf5a97"]

    constructor(props) {
        super(props);

        this.state = { windowWidth: window.innerWidth, viewState: "normal" };

        this.eventBox = React.createRef()
    }

    handleResize = (e) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }


    _toggleEventBox(event) {

        if (this.state.viewState === "normal") {
            this.eventBox.current.className = "box";
            this.state.viewState = "details";
        } else {
            this.eventBox.current.className = "is-hidden box";
            this.state.viewState = "normal";
        }
    }

    _switchState() {

    }

    _createEventBox() {
        let depth = `${(this.props.eventstate.end - this.props.eventstate.start) * 80 - 20}px`
        let marg = this.props.eventstate.day === 6 ? `${depth} 0px -50px 0px` : `${depth} 0px 0px 50px`;

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
                <header className="card-head">
                    <p className="has-text-left has-text-weight-semibold" style={{ fontSize: "15px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this.props.eventstate.name}</p>
                    <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this._findTime(this.props.eventstate.start)} - {this._findTime(this.props.eventstate.end)}</p>
                    <hr className="hr" style={{ margin: "2px" }}></hr>
                    <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this.props.eventstate.location}</p>
                    <hr className="hr" style={{ margin: "2px" }}></hr>
                    <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this.props.eventstate.description}</p>
                </header>

            </div>

        )
    }

    _findHour(time) {
        if (time < 12) { return time === 0 ? "12 AM" : time + " AM" }
        else { return (time % 12) === 0 ? "12 PM" : (time % 12) + " PM" }

    }

    _findTime(time) {
        return this._findHour(time)

    }


    render() {
        const event_style = {
            width: `${(this.state.windowWidth - 250) / 8}px`,
            position: "absolute",
            height: `${(this.props.eventstate.end - this.props.eventstate.start) * 80}px`,
            backgroundColor: this.catcolors[this.props.eventstate.category % 9],
            margin: "0px",
            padding: "10px"
        }

        return (
            <div>
                <div style={event_style} className="box week-event" /*onDoubleClick={this.toggleEventEditBox}*/ onClick={this._toggleEventBox.bind(this)}>
                    <p className="has-text-left" style={{ fontSize: "13px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this._findTime(this.props.eventstate.start)} - {this._findTime(this.props.eventstate.end)}</p>
                    <p className="has-text-left has-text-weight-semibold" style={{ fontSize: "15px", color: this.darkcatcolors[this.props.eventstate.category % 9] }}>{this.props.eventstate.name}</p>
                </div>
                {this._createEventBox()}
            </div>


        )
    }
}

export default WeekEvent;