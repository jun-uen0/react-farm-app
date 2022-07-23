import axios from 'axios'
import { useAppDispatch } from '../app/hooks'
import { useQueryClient, useMutation } from 'react-query'
import { resetEditedTask, toggleCsrfState } from '../slices/appSlice'
import { Task } from '../types/types'
import { useNavigate } from 'react-router-dom'

export const useMutateTask = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Omit<Task,'id'> is a type guard
  const createTaskMutation = useMutation((task: Omit<Task,'id'>) => 
    axios.post<Task>(`${process.env.REACT_APP_API_URL}/todo`, task, { 
      withCredentials: true, // To use cookies
    }),
    {
      onSuccess: (res) => {
         // To get the previous todos by querying the query client with key 'tasks'
        const previousTodos = queryClient.getQueryData<Task[]>('tasks') // List
        if (previousTodos) {
          queryClient.setQueryData('tasks', [...previousTodos, res.data]) // Add the new task to the end of list
        }
        dispatch(resetEditedTask()) // Reset the edited task
      },
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        if (
          err.response.data.detail === 'The JWT has expired' || // Token expired
          err.response.data.detail === 'The CSRF token has expired.'
        ) {
          dispatch(toggleCsrfState())
          dispatch(resetEditedTask())
          navigate('/')
        }
      },
    }
  )
  const updateTaskMutation = useMutation((task: Task) =>
    axios.put<Task>(`${process.env.REACT_APP_API_URL}/todo/${task.id}`,
    { 
      title: task.title,
      description: task.description,
    },
    {
      withCredentials: true, // To use cookies
    }
    ),
    {
      onSuccess: (res,variables) => { // variables is the task updated
        const previousTodos = queryClient.getQueryData<Task[]>('tasks') // List
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.map(task => {
              return task.id === variables.id // if the task id is the same as the updated task id
              ? res.data // return the updated task
              : task // else return the original task
            })
          )
        }
        dispatch(resetEditedTask())
      },
      // Error handling is same as createTaskMutation
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        if (
          err.response.data.detail === 'The JWT has expired' ||
          err.response.data.detail === 'The CSRF token has expired.'
        ) {
          dispatch(toggleCsrfState())
          dispatch(resetEditedTask())
          navigate('/')
        }
      },
    }
  )

  const deleteTaskMutation = useMutation((id: string) =>
    axios.delete<Task>(`${process.env.REACT_APP_API_URL}/todo/${id}`, {
      withCredentials: true,
    }),
    {
      onSuccess: (res,variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>('tasks')
        if (previousTodos) {
          queryClient.setQueryData<Task[]>(
            'tasks',
            previousTodos.filter(task => {
              task.id !== variables // Remove the task deleted from the list
            }
            )
          )
        }
        dispatch(resetEditedTask())
      },
      // Error handling is same as createTaskMutation
      onError: (err: any) => {
        alert(`${err.response.data.detail}\n${err.message}`)
        if (
          err.response.data.detail === 'The JWT has expired' ||
          err.response.data.detail === 'The CSRF token has expired.'
        ) {
          dispatch(toggleCsrfState())
          dispatch(resetEditedTask())
          navigate('/')
        }
      },
    }
  )
  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    
  }
}