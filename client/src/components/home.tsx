import axios from 'axios'
import { Button } from './ui/button'

const Home = () => {
  const api = axios.create({
    baseURL: 'http://localhost:4001',
    withCredentials: true,
  })

  return (
    <>
      <div className="flex flex-row gap-5">
        <Button
          onClick={async (e) => {
            e.preventDefault()
            const res = await api.post('/login', {
              email: 'user@example.com',
              password: 'user12345',
              rememberMe: true,
            })
            console.log(res)
          }}
        >
          Sign-In
        </Button>
        <Button>Sign-Up</Button>
        <Button
          onClick={async (e) => {
            e.preventDefault()
            const res = await api.post('/logout')

            console.log(res)
          }}
        >
          Sign-Out
        </Button>
      </div>
    </>
  )
}

export default Home
