import { useRouter } from 'next/router'
export default () => {
    const router = useRouter()

    const gotoGoogleLogin = () => {
        localStorage.removeItem("token")
        if (localStorage.getItem("token") == null)
            fetch("http://localhost:8080/").then(res => res.json()).then(res => {
                router.push(res.url)
            })
        else
            router.push("/listEvent")
    }
    return (
        <div>
            <button onClick={gotoGoogleLogin}>show my event</button>
            {/* <a href="https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=17396122997-4o7u18t5nl0u6m835fkgg3h14pq7nil6.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcalendar&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly&state=state-token">Show my calendar</a> */}
        </div>
    )
}