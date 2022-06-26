import axios from 'axios'
import { useNavigate } from 'react-router-dom' // replace to useNavigate from useHistory
import { useMutation } from 'react-query'
import { useAppDispatch } from '../app/hooks'
import { resetEditedTask, toggleCsrfState } from '../slices/appSlice'
import { User } from '../types/types'


export const useMutateAuth = () => {
  const navidate = useNavigate()
  const dispatch = useAppDispatch()

  const loginMutation = useMutation(
    async (user: User) =>
      await axios.post(`${process.env.REACT_APP_API_URL}/login`, user, {
        withCredentials: true,
      }),
    {
      onSuccess: () => {
        navidate('/todo')
      },
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        if (err.response.data.detail === 'The CSRF token has expired.') {
          dispatch(toggleCsrfState())
        }
      },
    }
  )
  const registerMutation = useMutation(
    async (user: User) =>
      await axios.post(`${process.env.REACT_APP_API_URL}/register`, user),
    {
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        if (err.response.data.detail === 'The CSRF token has expired.') {
          dispatch(toggleCsrfState())
        }
      },
    }
  )
  const logoutMutation = useMutation(
    async () =>
      await axios.post(
        `${process.env.REACT_APP_API_URL}/logout`,
        {}, // post require data in second argument, but it is not used in logout
        {
          withCredentials: true, // enale withCredentials to send cookie
        }
      ),
    {
      onSuccess: () => {
        navidate('/')
      },
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        if (err.response.data.detail === 'The CSRF token has expired.') {
          dispatch(toggleCsrfState()) // toggle csrf state
          dispatch(resetEditedTask()) // reset edited task after logout
          navidate('/')
        }
      },
    }
  )
  return { loginMutation, registerMutation, logoutMutation }
}