import React, { Component } from 'react';
import { useState } from 'react';
import Task from './task';
import StickyNote from './sticknotes'
import NewEntry from './newentry'
import ReactDOM from 'react-dom'
import DayEvent from './dayEvent'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';

class Day extends Component {
    state = {}
    tasklist = ["get", "this", "to", "work", "check", "task", "scroll", "power"]

    eventlist = [
        { day: 0, start: 9, end: 10.5, name: "Breakfast in Durham", category: 5 },
        { day: 0, start: 11, end: 13, name: "History Lecture", category: 0 },
        { day: 0, start: 14, end: 15.5, name: "Math Lecture", category: 4 },
        { day: 0, start: 16, end: 18, name: "426 Lecture", category: 8 },
        { day: 0, start: 19, end: 20, name: "Dinner with Friends", category: 0 }]

    constructor(props) {
        super(props);

        this.scrollBox = React.createRef()

        this.timeRef = {}

        for (let i = 0; i < 24; i++) {
            this.timeRef[`${i}`] = React.createRef()
        }

        var now = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var day = days[now.getDay()];
        var month = months[now.getMonth()];

        let writtendate = day + ", " + month + " " + now.getDate() + "th"

        this.state = { day: writtendate }

    }

    componentDidMount() {
        this.scrollBox.current.scrollTop = 800
        this._rendercurrentevents()
    }

    _findHour(time) {
        if (time < 12) { return time === 0 ? "12 AM" : time + " AM" }
        else { return (time % 12) === 0 ? "12 PM" : (time % 12) + " PM" }

    }

    _renderRowByHour(time) {
        return (
            <tr style={{ width: "100px" }}>
                <th className="has-text-grey-light has-text-left is-narrow">{this._findHour(time)}</th>
                <td ref={this.timeRef[`${time}`]} style={{ padding: "0px" }}></td>
            </tr>
        )
    }

    _renderBody() {
        let rows = [];
        for (let i = 0; i < 24; i++) {
            rows.push(this._renderRowByHour(i));
        }
        return (
            <tbody style={{ width: "50px" }}>
                {rows}
            </tbody>
        )
    }

    toggletaskform(event) {
        event.persist();
        // let name = event.target.id;
        let edit_box = document.getElementById("newtask");

        if (edit_box.className === "modal is-active") {
            edit_box.className = "modal";
        } else {
            edit_box.className = "modal is-active";
        }
    }

    createTask(event) {
        let tasktext = this.refs.tasktext.value;
        this.tasklist.push(tasktext)
        // window.alert(tasktext)
        this.toggletaskform(event)
        const d = document.createElement("div")
        const id = Math.random()
        d.id = id
        document.getElementById('newtasks').appendChild(d)
        // ReactDOM.render((<div className="box" style={{margin: "10px"}}>
        // <input type="checkbox"/>
        // <label className="task" style={{marginLeft: "5px"}}>{tasktext}</label><br/>
        // </div>), document.getElementById(id));
        ReactDOM.render(<Task text={tasktext}></Task>, document.getElementById(id));

    }

    // strikeTask(event) {
    //     ReactDOM.render((<div><label for="task2" className="task" id="task2text" style={{textDecoration: 'line-through'}}> start adding data!!</label>
    //                             <p>Task Complete!</p></div>), document.getElementById("task2text"));
    // }

    rendertaskform() {
        return (<div id="newtask" className="modal">
            <div className="modal-background"></div>
            <div className="modal-card">
                <header className="modal-card-head" >
                    <p className="modal-card-title">Create a new task:</p>
                    <button onClick={this.toggletaskform} className="delete" aria-label="close"></button>
                </header>
                <div className="control is-horizontal">
                    <input className="input" ref="tasktext" type="text" placeholder="New Task" />
                </div>
                <section id="login-box-content" className="modal-card-body">
                </section>
                <footer className="modal-card-foot">
                    <button className="button create" id="createtask" onClick={this.createTask.bind(this)}>Create</button>
                </footer>

            </div>
        </div>)
    }

    rendercurrenttasks() {
        const tasks = []
        for (let i = 0; i < this.tasklist.length; i++) {
            tasks.push(<Task text={this.tasklist[i]}></Task>)
        }
        return tasks
    }

    _rendercurrentevents() {
        for (let i = 0; i < this.eventlist.length; i++) {
            let evt = this.eventlist[i]
            ReactDOM.render(<DayEvent eventstate={evt}></DayEvent>, this.timeRef[`${evt.start}`].current)
        }
    }

    updateDate(dir) {
        // just for funzies so we can see it update, feel free to remove once we have backend if necessary :)
        // this does NOT work month to month lol 
        var now = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var arrayver = this.state.day.split(',')
        var dayindex = days.indexOf(arrayver[0])


        if (dir == 1) {
            if (dayindex < 6) {
                dayindex = dayindex + 1
            } else {
                dayindex = 0
            }
        } else {
            if (dayindex > 0) {
                dayindex = dayindex - 1
            } else {
                dayindex = 6
            }
        }

        var num = parseInt(arrayver[1].split(" ")[2].substring(0, 2)) + dir

        var day = days[dayindex];
        var month = months[now.getMonth()];

        let writtendate = day + ", " + month + " " + num + "th"
        this.setState({ day: writtendate })

    }

    getCurrentDate() {
        var now = new Date();
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        var day = days[now.getDay()];
        var month = months[now.getMonth()];

        let writtendate = day + ", " + month + " " + now.getDate() + "th"
        return writtendate
    }

    render() {
        let header_style = { position: "sticky", top: "0px", zIndex: "2", backgroundColor: "#fff" }

        return (

            <div className="daysview columns" style={{ margin: "0px" }}>
                <div className="calendar column is-half">
                    <div className="container is-half">
                        <section className="level" style={{ backgroundColor: "#b5e3f8", height: "50px" }}>
                            <div className="level-left">
                                <h1 className="has-text-light" style={{ fontSize: "60px", marginTop: "10px" }} onClick={() => this.updateDate(-1)}><BiChevronLeft /></h1>
                                <h1 className="title has-text-light" style={{ margin: "20px" }}>{this.state.day} </h1>
                            </div>
                            <div className="level-right">
                                <NewEntry></NewEntry>
                                <h1 className="has-text-light" style={{ fontSize: "60px", marginTop: "10px" }} onClick={() => this.updateDate(1)}><BiChevronRight /></h1>
                            </div>

                        </section>
                    </div>
                    <div className="container box" ref={this.scrollBox} style={{ margin: "10px", height: "575px", overflow: "scroll", padding: "0px" }}>
                        <table className="table is-bordered is-narrow is-hoverable is-fullwidth">
                            <thead style={header_style}>
                                <tr className="is-bordered" style={header_style}>
                                    <th style={header_style}></th>
                                    <th className="has-text-grey-light is-4" style={header_style}>Events</th>
                                </tr>
                            </thead>
                            {this._renderBody()}
                        </table>
                    </div>
                    <div style={{ height: "30px" }}></div>

                </div>
                <div className="dailytodo container column is-half" style={{ backgroundColor: "#0b1846" }}>
                    <section className="level" style={{ backgroundColor: "#0b1846", height: "50px", marginBottom: "8px" }}>
                        <h1 className="title has-text-light" style={{ margin: "10px" }}>My Daily To-Do:</h1>
                    </section>
                    <div class="columns" style={{ height: "100%" }}>
                        <div className="container tasklist box column" id="tasklist" style={{ backgroundColor: "white", height: "575px", overflow: "scroll", margin: "15px" }}>
                            <button className="button create is-rounded" style={{ backgroundColor: "#606163", color: "white" }} onClick={this.toggletaskform.bind(this)}>New Task</button>
                            {this.rendercurrenttasks()}
                            <div id="newtasks"></div>
                            {this.rendertaskform()}
                        </div>
                        <div class="column is-half stickynotes">
                            <StickyNote color="lightyellow"></StickyNote>
                            <StickyNote color="lightpink"></StickyNote>
                            <StickyNote color="lightblue"></StickyNote>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Day;

// <input type="checkbox" id="task2" name="task2" onClick={this.strikeTask.bind(this)}/>

// readd todo list button


// change height of the todo so it isnt fucked 
// fix icon height if not already fixed 
// integrate news api instead of stickies
// get tasks dynamically updating from our database info 
// consider if we want a login screen / what we should display when not logged in 
