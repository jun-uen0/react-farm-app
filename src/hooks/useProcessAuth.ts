import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom' // replace to useNavigate from useHistory
import { useQueryClient } from 'react-query'
import { useMutateAuth } from './useMutateAuth'

export const useProcessAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const { loginMutation, registerMutation, logoutMutation } = useMutateAuth()

  // when login button is clicked, call loginMutation or registerMutation
  const processAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      try {
        // execute login mutation by .mutate()
        loginMutation.mutate({
          email: email,
          password: pw,
        })
      } catch (err) {
        console.error('Login failed')
      }
    } else {
      await registerMutation
        .mutateAsync({
          email: email,
          password: pw,
        })
        .then(() =>
        // if register succeed, login
          loginMutation.mutate({
            email: email,
            password: pw,
          })
        )
        .catch(() => {
          // if register failed, initialize email and pw
          setEmail('')
          setPw('')
          console.error('Register or Login after registeratoin failed')
        })
    }
  }

  // when logout button is clicked, call logoutMutation
  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries('tasks')
    queryClient.removeQueries('user')
    queryClient.removeQueries('single')
    navigate('/') // redirect to home page
  }
  return {
    email,
    setEmail,
    pw,
    setPw,
    isLogin,
    setIsLogin,
    processAuth,
    registerMutation,
    loginMutation,
    logout,
  }
}