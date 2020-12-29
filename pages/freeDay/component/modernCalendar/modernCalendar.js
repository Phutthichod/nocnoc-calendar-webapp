import React, { useState } from "react";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from "react-modern-calendar-datepicker";
import { Grid } from '@material-ui/core'
import { useEffect } from 'react'
const App = ({ busyDay, onClickDay, handleOpen, disableDate }) => {
    console.log(disableDate)
    // ✅ a change in default state: []
    const d = new Date()
    const defaultValue = {
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        day: d.getDate(),
    };
    const [selectedDays, setSelectedDays] = useState(defaultValue);
    const [footerEvent, setFooterEvent] = useState([])
    // console.log(busyDay)
    const footerCompoent = () => {
        return <Grid container alignContent="center" direction="column" style={{ marginBottom: 50 }} justify="center">
            {footerEvent.length > 0 ? footerEvent.map(item => {
                return <h2>{item.start + " - " + item.end + " busy"}</h2>
            }) : <h2>no event</h2>}
        </Grid>

    }
    useEffect(() => {
        // let d = new Date()
        // onClickDay({ day: selectedDays.day.toString(), year: selectedDays.year.toString(), month: selectedDays.month.toString() }, (data) => {
        //     let event = data ? data.map(item => {
        //         let dStart = new Date(item.start)
        //         let dEnd = new Date(item.end)
        //         const start = dStart.getHours() + ":" + dStart.getMinutes()
        //         const end = dEnd.getHours() + ":" + dEnd.getMinutes()
        //         return { start, end }
        //     }) : []
        //     setFooterEvent(event)
        // })
    }, [])
    return (
        <div>
            <Calendar
                value={selectedDays}
                // customDaysClassName={busyDay}
                onChange={(newValue) => {
                    console.log(newValue)
                    onClickDay({ day: newValue.day.toString(), year: newValue.year.toString(), month: newValue.month.toString() })
                    // onClickDay({ day: newValue.day.toString(), year: newValue.year.toString(), month: newValue.month.toString() }, (data) => {
                    //     handleOpen()
                    //     // console.log(data.length)
                    //     if (data?.length > 0) {
                    //         let event = data.map(item => {
                    //             let dStart = new Date(item.start)
                    //             let dEnd = new Date(item.end)
                    //             const start = dStart.getHours() + ":" + dStart.getMinutes()
                    //             const end = dEnd.getHours() + ":" + dEnd.getMinutes()
                    //             return { start, end }
                    //         })
                    //         setFooterEvent(event)
                    //     } else
                    //         setFooterEvent([])
                    // })
                    setSelectedDays(newValue)
                }}
                // onClick={() => { console.log("click") }}
                // colorPrimary="#f54242"
                disabledDays={disableDate}
                shouldHighlightWeekends
                minimumDate={utils().getToday()}
            // renderFooter={footerCompoent}
            />
            <style global jsx>{`
                    .purpleDay:not(.-selectedStart):not(.-selectedBetween):not(.-selectedEnd):not(.-selected) {
                        border: 2px solid rgba(156, 136, 255, 0.7) !important;
            }
            `}</style>
        </div>
    );
};

export default App;