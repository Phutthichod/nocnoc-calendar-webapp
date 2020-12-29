import React, { useState, useRef, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Grid } from '@material-ui/core'
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));
const rangeTime = [{ start: "9.00", end: "12.00" }, { start: "12.00", end: "15.00" }, { start: "15.00", end: "18.00" }, { start: "18.00", end: "21.00" }]
export default function FormDialog({ open, handleClose, optionTime, sendEvent, dateSelect }) {
    const classes = useStyles();
    const [value, setValue] = useState(1)
    const summaryRef = useRef("")
    const timeRef = useRef("")
    console.log(dateSelect)
    const handleChange = (event) => {
        console.log(event.target.value)
        setValue(event.target.value);
    };
    const submitForm = () => {
        // sendEvent()
        // console.log(timeRef.current.value, summaryRef.current.value)
        let times = timeRef.current.value.split("-")
        console.log(times[0].slice(0, 2) + ":" + times[0].slice(3, 5))
        let timeStart = times[0].slice(0, 2) + ":" + times[0].slice(3, 5)
        let timeEnd = times[1].slice(0, 2) + ":" + times[1].slice(3, 5)
        sendEvent({ summary: summaryRef.current.value, calendarId: "pin2041to@gmail.com", start: new Date((dateSelect + timeStart)), end: new Date((dateSelect + timeEnd)) })
        // handleClose()
    }
    useEffect(() => {

    }, [])
    return (
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add Event</DialogTitle>
                <DialogContent>
                    <Grid container direction="column">
                        <TextField inputRef={summaryRef} label="Summary" />
                        {/* <Typography>select time range</Typography> */}
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="age-native-simple">Time</InputLabel>
                            <Select
                                inputRef={timeRef}
                                native
                                value={value}
                                onChange={handleChange}
                            // inputProps={{
                            //     name: 'age',
                            //     id: 'age-native-simple',
                            // }}
                            >
                                {/* <option aria-label="None" value="" /> */}
                                {
                                    optionTime.map((item, i) => <option value={item.start + "-" + item.end} disabled={item.disabled} >{item.start + "-" + item.end}</option>)
                                }
                                {/* <option value={10}>Ten</option>
                            <option value={20}>Twenty</option>
                            <option value={30}>Thirty</option> */}
                            </Select>
                        </FormControl>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={submitForm} color="primary">
                        Send
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
