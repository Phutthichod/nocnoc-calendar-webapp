import { useRouter } from 'next/router'
import { useLayoutEffect, useState } from 'react'
function Calendar() {
    const router = useRouter()
    const [eventList, setEventList] = useState([])
    useLayoutEffect(() => {
        console.log(router.query)
        if (router.query.code) {
            fetch("http://localhost:8080/token", {
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                }, body: JSON.stringify({
                    code: router.query.code
                })
            }).then(res => res.json()).then(res => {
                console.log(res)
                if (res.token) {
                    localStorage.setItem("token", JSON.stringify(res.token))
                    router.push("/listEvent")
                }


                // setEventList([...res.list])
            })
        }

    }, [router])

    console.log("render");
    return (
        <>
            <h1>Calendar me</h1>
            {eventList.map((item, i) => {
                return <div key={i}><h3>{item.name}</h3><span>{item.date}</span></div>
            })}
        </>
    )
}
export default Calendar