import { TextField, Grid, Button } from "@material-ui/core"
import { useRef } from 'react'
const FormAddEvent = ({ email, onSubmit }) => {
    const dateStartRef = useRef()
    const dateStopRef = useRef()
    const summaryRef = useRef()

    const onSubmitButton = () => {
        const summary = summaryRef.current.value
        const start = new Date(dateStartRef.current.value)
        const end = new Date(dateStopRef.current.value)
        console.log(typeof new Date(dateStopRef.current.value), start)
        onSubmit(summary, start, end, email)
    }
    return (
        <>
            {/* <Grid container direction="column"> */}
            <Grid container direction="column" >
                <TextField label="Summary" inputRef={summaryRef} />
                <TextField
                    id="datetime-local"
                    label="Start"
                    type="datetime-local"
                    defaultValue="2020-12-24T10:30"
                    // className={classes.textField}
                    inputRef={dateStartRef}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="datetime-local"
                    label="Stop"
                    type="datetime-local"
                    defaultValue="2020-12-24T11:30"
                    // className={classes.textField}
                    inputRef={dateStopRef}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button onClick={onSubmitButton} variant="contained" color="primary">
                    Add Event to {email}
                </Button>
            </Grid>
            {/* </Grid> */}
        </>)
}

export default FormAddEvent