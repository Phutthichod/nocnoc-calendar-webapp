import { useRouter } from 'next/router'
import { useLayoutEffect, useState } from 'react'
import Link from 'next/link'
function Calendar() {
    const router = useRouter()
    const [eventList, setEventList] = useState([])
    const logout = () => {
        localStorage.removeItem("token")
        router.push("/")
    }
    const insertEvent = () => {
        const token = JSON.parse(localStorage.getItem("token"))
        console.log(token)
        fetch("http://localhost:8080/insertEvent", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            }, body: JSON.stringify({
                token: token
            })
        }).then(res => res.json()).then(res => {
            console.log(res)
            // if (res.token)
            //     localStorage.setItem("token", JSON.stringify(res.token))
            // setEventList([...res.list])
        })
    }
    useLayoutEffect(() => {
        const token = JSON.parse(localStorage.getItem("token"))
        console.log(token)
        if (token) {
            fetch("http://localhost:8080/eventFromToken", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }, body: JSON.stringify({
                    token: token
                })
            }).then(res => res.json()).then(res => {
                console.log(res)
                // if (res.token)
                //     localStorage.setItem("token", JSON.stringify(res.token))
                if (res.list)
                    setEventList([...res.list])
            })
        }

    }, [])

    console.log("render");
    return (
        <>
            <h1>My Event</h1>
            {eventList.map((item, i) => {
                return <div key={i}><h3>{item.summary}</h3><span>{item.date}</span></div>
            })}
            <div style={{ height: 200 }}></div>
            <Link href="/">back home</Link>
            <button onClick={logout}>lockout</button>
            <button onClick={insertEvent}>upload event</button>

        </>
    )
}
export default Calendar