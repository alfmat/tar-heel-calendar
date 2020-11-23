import React, { Component } from 'react';
import { unmountComponentAtNode } from "react-dom";
import ReactDOM from 'react-dom'
import axios from '../../node_modules/axios/index.js';

class Task extends Component {

    constructor() {
        super()
        // window.alert("hello")
        this.state = { style: { textDecoration: 'none', margin: "10px", hideComponent: false, loggedIn: this._getCookie("token").length === 60 } }
    }

    _getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        else return ""

    }

    async strikethrough() {
        if (this.state.style.textDecoration == "none") {
            this.setState({ style: { textDecoration: 'line-through', backgroundColor: '#bebfc2', margin: "10px" } })
        } else {
            this.setState({ style: { textDecoration: 'none', margin: "10px" } })
        }
    }

    async deleteTask() {
        // task is now hidden but not actually removed from our list
        if (this.state.loggedIn) {
            const results = await axios({
                method: 'delete',
                url: 'https://tar-heel-calendar.herokuapp.com/deletetask',
                data: {
                    token: this._getCookie("token"),
                    id: this.props.id
                }
            });

            if (results.data.message === "Deleted task.") {
                this.setState({ hideComponent: true })

            }
        }


    }


    render() {
        if (this.state.hideComponent === true) { return false; }

        return (
            <div className="box" style={this.state.style} onClick={this.strikethrough.bind(this)}>
                <button className="delete is-small" style={{ float: "right" }} aria-label="close" onClick={this.deleteTask.bind(this)}></button>
                <label className="task" style={this.state.style}>{this.props.text}</label><br />
            </div>

        )
    }
}

export default Task