import { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Grid } from '@material-ui/core'
import { TuiCalendar, ModernCalendar, DialogFromAddEvent } from './component'
const localizer = momentLocalizer(moment)
console.log(moment.locale("th"), moment().format())
export default function index() {
    const [events, setEvents] = useState([])
    const [busyDay, setBusyDay] = useState([])
    const [openFormAdd, setOpenFormAdd] = useState(false)
    const [optionTime, setOptionTime] = useState([])
    const [disableDate, setDisableDate] = useState([])
    const [dateSelect, setDateSelect] = useState("")
    // let dateSelect = ""
    const converts = (d) => {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
                d.constructor === Array ? new Date(d[0], d[1], d[2]) :
                    d.constructor === Number ? new Date(d) :
                        d.constructor === String ? new Date(d) :
                            typeof d === "object" ? new Date(d.year, d.month, d.date) :
                                NaN
        );
    }
    const dateCompare = (a, b) => {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a = converts(a).valueOf()) &&
                isFinite(b = converts(b).valueOf()) ?
                (a > b) - (a < b) :
                NaN
        );
    }
    const customSlotPropGetter = date => {
        if (date.getDate() === 7 || date.getDate() === 15)
            return {
                className: 'special-day',
            }
        else return {}
    }
    const customDayPropGetter = date => {
        let d = new Date()
        const res = dateCompare(date.toLocaleDateString("en-US"), d.toLocaleDateString("en-US"))
        if (res < 0)
            return {
                className: 'special-day',
                style: {
                    // border: 'solid 3px ' + (date.getDate() === 7 ? '#faa' : '#afa'),
                    backgroundColor: 'pink'
                },
            }
        else return {}
    }
    const handleSelect = ({ start, end }) => {
        let d = new Date()
        const res = dateCompare(end, d.toLocaleDateString("en-US"))
        if (res > -1) {
            const title = window.prompt('New Event name')
            if (title)
                setEvents([...events, {
                    start,
                    end,
                    title,
                }])
        }
    }
    const handleClose = () => {
        setOpenFormAdd(false);
    };
    const handleOpen = () => {
        setOpenFormAdd(true);
    };
    const getBusyByDate = ({ year, month, day }) => {
        console.log("setOpenFormAdd")
        // setOpenFormAdd(true)
        setDateSelect(`${year}-${month}-${day}T`)
        const token = JSON.parse(localStorage.getItem("token"))
        if (token) {
            fetch("http://localhost:8080/freeDayByDate", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    token,
                    date: {
                        year, day, month
                    }
                })
            }).then(res => res.json()).then(res => {
                // let newEvent = res.calendars['pin2041to@gmail.com'].busy
                let newEvent = res.rangeTime
                setOptionTime(newEvent)

                handleOpen()
                // callback(newEvent)
            })
        }
    }
    const sendEvent = ({ calendarId, summary, start, end }) => {
        console.log({ calendarId, summary, start, end })
        fetch("http://localhost:8080/sendEventToInstaller", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({
                // token,
                calendarId: "pin2041to@gmail.com", summary, start, end
            })
        }).then(res => res.json()).then(res => {
            console.log(res)
            // handleClose()
        })
    }
    const getOldBusyDay = (res) => {
        console.log(res.calendars['pin2041to@gmail.com'].busy)
        let newEvent = res.calendars['pin2041to@gmail.com'].busy
        newEvent = newEvent.map(item => {
            item.title = "busy"
            item.start = new Date(item.start)
            item.end = new Date(item.end)
            return item
        })
        const selectDays = newEvent.map(item => {
            // for(let i = item.start.getDate())
            const val = {
                day: item.start.getDate(),
                year: item.start.getFullYear(),
                month: item.start.getMonth() + 1,
                className: 'purpleDay'
            }
            return val
        })
        console.log(selectDays)
        setBusyDay(selectDays)
        setEvents(newEvent)
    }
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"))
        if (token) {
            fetch("http://localhost:8080/freeDay", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }, body: JSON.stringify({
                    token,
                })
            }).then(res => res.json()).then(res => {
                // getOldBusyDay(res)
                console.log(res)
                let disableDate = []
                let i
                for (i in res.dateDisables) {
                    // console.log(i)
                    const [year, month, day] = i.split("-")
                    disableDate.push({
                        year: Number(year), month: Number(month), day: Number(day)
                    })
                }
                setDisableDate(disableDate)
                // setBusyDay(selectDays)

            })
        }
    }, [])
    return (
        <div>
            <Grid container spacing={2} justify="center" style={{ marginTop: 25 }}>
                {/* <Grid item xs={12} md={6} sm={6}>
                    {events.length > 0}
                    <Calendar
                        localizer={localizer}
                        events={events}
                        onSelectEvent={event => alert(event.title + "\nstart " + event.start + "\nstop " + event.end)}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                        selectable={true}
                        onSelectSlot={handleSelect}
                        slotPropGetter={customSlotPropGetter}
                        dayPropGetter={customDayPropGetter}
                    />
                </Grid> */}
                <Grid item>
                    <ModernCalendar disableDate={disableDate} busyDay={busyDay} onClickDay={getBusyByDate} handleOpen={handleOpen} />
                </Grid>

            </Grid>

            <DialogFromAddEvent dateSelect={dateSelect} sendEvent={sendEvent} open={openFormAdd} handleClose={handleClose} optionTime={optionTime} />
        </div>
    )
}
