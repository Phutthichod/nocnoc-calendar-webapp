import { Grid, TextField } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { EventInstallation, FormAddEvent } from './component'
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import React from 'react'
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));
const InstallationCalendar = () => {
    const [dataInstallation, setDataInstallation] = useState([])
    const [time, setTime] = useState(Date.now());
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState("event uploading ....");
    const [statusUpdateCalendar, setStatusUpdateCalendar] = React.useState("")
    const handleClose = () => {
        setOpen(false);
    };

    const sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    const addEvent = (summary, start, end, calendarId) => {
        const token = JSON.parse(localStorage.getItem("token"))
        if (token) {
            setStatus(" event uploading ...")
            setOpen(true);
            fetch("http://localhost:8080/insertEventFromCanlendarID", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }, body: JSON.stringify({
                    token,
                    summary,
                    start,
                    end,
                    calendarId
                })
            }).then(res => res.json()).then(res => {
                console.log(res)
                if (res.status == "ok")
                    setStatus("event upload  success")
                else
                    setStatus("event upload  fail")
                //     setDataInstallation([...res.data])
            })
        }
    }
    const fetchData = () => {
        const token = JSON.parse(localStorage.getItem("token"))
        if (token) {
            fetch("http://localhost:8080/eventInstallationFromToken", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }, body: JSON.stringify({
                    token: token
                })
            }).then(res => res.json()).then(res => {
                console.log(res)
                if (res.data) {
                    setDataInstallation([...res.data])
                    setStatusUpdateCalendar("update calendar")
                    sleep(1000).then(() => {
                        let d = Date()
                        d = d.toString()
                        setStatusUpdateCalendar("last update " + d)
                    });
                }
                else {
                    setStatusUpdateCalendar("not connect server")
                }


            })
        }
    }
    useEffect(() => {
        fetchData()
        // InstallationsData.map()

        const interval = setInterval(() => fetchData(), 50000);
        console.log(time)
        return () => {
            clearInterval(interval);
        };


    }, [])
    return <>
        <h2 style={{ float: "left" }}>ตารางงานของช่างทีดึงข้อมูลมาจาก google calendar</h2><h3 style={{ float: "right" }}>{statusUpdateCalendar}</h3>
        <Grid container direction="row" justify="center" alignItems="stretch" spacing={2}>
            {dataInstallation.map(item => {
                const eventsData = item.events.map(event => {
                    return { summary: event.summary, date: event.date }
                })
                return <Grid item xs={4}><EventInstallation name={item.name} email={item.email} events={eventsData} /></Grid>
            })}
            {dataInstallation.map(item => <Grid item xs={4}><FormAddEvent onSubmit={addEvent} email={item.email} /></Grid>)}
        </Grid>

        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <div className={classes.paper}>
                    <h2 id="transition-modal-title">Status</h2>
                    <p id="transition-modal-description">{status}</p>
                </div>
            </Fade>
        </Modal>
    </>
}

export default InstallationCalendar