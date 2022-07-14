import { useQuery } from "react-query"
import axios from "axios"
import { Task } from "../types/types"

// useQueryTasks returns a tuple of the current tasks and a function to fetch them
// For example, useQueryTasks()[0] will return the current tasks
export const useQueryTasks = () => {
  const getTasks = async () => {
    // The reason why we use curly brackets is because we want to use the data property of the response
    const { data } = await axios.get<Task[]>(
      `${process.env.REACT_APP_API_URL}/todo`,
      { withCredentials: true } // To use JWT tokens stored in the browser (cookies)
    )
    return data
  }
  return useQuery<Task[], Error>({
    // what is queryKey? It's a string that is used to identify the query
    // If you want to fetch the same data again, you can use the key
    queryKey: "tasks",

    // what is queryFn? It's a function that returns the data we want to fetch
    queryFn: getTasks,

    // what is staleTime? It's a number that represents the time in milliseconds after which the query will be considered stale
    // For example, if we set staleTime to 1000, then the query will be considered stale after 1 second
    // defintion of stale: unfresh, tasteless.
    staleTime: Infinity, 
  })
}