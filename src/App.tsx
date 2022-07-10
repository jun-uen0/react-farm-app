import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Auth } from './components/Auth'
import { Todo } from './components/Todo'
import { CsrfToken } from './types/types'
import { useAppSelector } from './app/hooks'
import { selectCsrfState } from './slices/appSlice'


function App() {
  const csrf = useAppSelector(selectCsrfState)
  useEffect(() => {
    console.log("process.env.REACT_APP_API_URL: " + process.env.REACT_APP_API_URL)
    const getCsrfToken = async () => {
      const res = await axios.get<CsrfToken>(
        `${process.env.REACT_APP_API_URL}/csrftoken`
        // `https://fastapi-amnmmkz.herokuapp.com/api/csrftoken`
      )
      axios.defaults.headers.common['X-CSRF-Token'] = res.data.csrf_token
      console.log("res.data.csrf_token: " + res.data.csrf_token)
    }
    getCsrfToken()
  }, [csrf])
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Auth/>} />
          <Route path='/todo' element={<Todo/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
