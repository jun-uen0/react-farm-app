import { VFC, useState } from 'react'
import { LogoutIcon } from '@heroicons/react/outline'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { setEditedTask, selectTask } from '../slices/appSlice'
import { useProcessAuth } from '../hooks/useProcessAuth'
// import { useProcessTask } from '../hooks/useProcessTask'
import { useQueryTasks } from '../hooks/useQueryTasks'
import { useQueryUser } from '../hooks/useQueryUser'
// import { useQuerySingleTask } from '../hooks/useQuerySingleTask'
// import { TaskItem } from './TaskItem'

export const Todo: VFC = () => {
  const { logout } = useProcessAuth()
  const { data: dataUser } = useQueryUser()
  const { data: dataTasks, isLoading: isLoadingTasks } = useQueryTasks() // useQuery return isLoading as boolean
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <LogoutIcon
        onClick={logout}
        className="h-8 w-8 mr-2 text-blue-500"
      />
    </div>
  )
}