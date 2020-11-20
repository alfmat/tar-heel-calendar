import React, { Component } from 'react';

class DayEvent extends Component {
    state = {}
    catcolors = ["#ffd4d4", "#ffe6d4", "#fffbd4", "#e2ffd4", "#d4ffec", "#d4f6ff", "#d4dfff", "#f0d4ff", "#ffd4ee"]

    constructor(props) {
        super(props);

        this.state = { windowWidth: window.innerWidth };

        this.eventBox = React.createRef()
    }

    handleResize = (e) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }


    _toggleEventBox(event) {

        if (this.eventBox.current.className === "is-hidden box eventBox") {
            this.eventBox.current.className = "box eventBox";
        } else {
            this.eventBox.current.className = "is-hidden box eventBox";
        }
    }

    _createEventBox() {


        return (
            <div ref={this.eventBox} className="is-hidden box eventBox" >
                <header className="card-head">
                    <p className="card-title">Here is this event!</p>
                </header>

            </div>

        )
    }


    render() {
        const event_style = {
            width: `${(this.state.windowWidth / 3)}px`,
            position: "absolute",
            height: `${(this.props.eventstate.end - this.props.eventstate.start) * 80}px`,
            backgroundColor: this.catcolors[this.props.eventstate.category % 9],
            margin: "0px",
        }

        return (
            <div>
                <div style={event_style} className="box" onClick={this._toggleEventBox.bind(this)}>
                    <p className="has-text-left">{this.props.eventstate.name}</p>
                </div>
                {this._createEventBox()}
            </div>


        )
    }
}

export default DayEvent;