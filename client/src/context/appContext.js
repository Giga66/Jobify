import React from "react"
import { useReducer, useContext } from "react"
import axios from 'axios'

import reducer from "./reducer"
import { DISPLAY_ALERT, CLEAR_ALERT, LOGIN_USER_BEGIN, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR, SETUP_USER_BEGIN, SETUP_USER_SUCCESS, SETUP_USER_ERROR, TOGGLE_SIDEBAR, LOGOUT_USER, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR } from "./actions"


const token = localStorage.getItem('token')
const userLocation = localStorage.getItem('location')
const user = localStorage.getItem('user')


const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    toekn: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
    showSidebar: false
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const authFecth = axios.create({
        baseURL: '/api/v1',
    })

    authFecth.interceptors.request.use((config) => {
        config.headers.common['Authorization'] = `Bearer ${state.token}`
        return config
    }, (error) => {
        return Promise.reject(error)
    })

    authFecth.interceptors.response.use((response) => {
        return response
    }, (error) => {
        console.log(error.response)
        if (error.response.status === 401) {
            console.log('AUTH ERROR');
        }
        return Promise.reject(error)
    })


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

    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            const { data } = await axios.post('/api/v1/auth/login', currentUser)
            const { user, token, location } = data

            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: { user, token, location },
            })

            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({
                type: LOGIN_USER_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
        clearAlert()
    }

    const setupUser = async ({ currentUser, endPoint, alertText }) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {
            const { data } = await axios.post(`/api/v1/auth/${endPoint}`, currentUser)

            const { user, token, location } = data
            dispatch({
                type: SETUP_USER_SUCCESS,
                payload: { user, token, location, alertText },
            })
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            dispatch({
                type: SETUP_USER_ERROR,
                payload: { msg: error.response.data.msg },
            })
        }
        clearAlert()
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage()
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const { data } = await authFecth.patch('/auth/updateUser', currentUser)

            const { user, location, token } = data

            dispatch({ type: UPDATE_USER_SUCCESS, payload: user, location, token })
            addUserToLocalStorage({ user, location, token })
        } catch (error) {
            if (error.response.status !== 401) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: { msg: error.response.data.msg },
                })
            }
        }
        clearAlert()
    }



    return (
        <AppContext.Provider value={{ ...state, displayAlert, loginUser, setupUser, toggleSidebar, logoutUser, updateUser }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext, }