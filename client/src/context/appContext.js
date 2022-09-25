import React from "react"
import { useReducer, useContext } from "react"
import axios from 'axios'

import reducer from "./reducer"
import { DISPLAY_ALERT, CLEAR_ALERT, REGISTER_USER_BEGIN, RESGISTER_USER_SUCCESS, REGISTER_USER_ERROR, REGISTER_USER_SUCCESS } from "./actions"


const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')
const user = localStorage.getItem('user')


const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user? JSON.parse(user) : null,
    toekn: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || ''
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)


    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(() => { dispatch({ type: CLEAR_ALERT }) }, 3000)
    }

    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('location')
    }

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN })
        try {
            const response = await axios.post('/api/v1/auth/register', currentUser)
            const { user, token, location } = response.data
            dispatch({ type: REGISTER_USER_SUCCESS, payload: { user, token, location } })
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({ type: REGISTER_USER_ERROR, payload: { msg: error.response.data.msg } })
        }
        clearAlert()
    }


    return (
        <AppContext.Provider value={{ ...state, displayAlert, registerUser }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }