import { FormRow, Alert, FormRowSelect } from '../../components'
import { useAppContext } from '../../context/appContext'
import Wrapper from '../../assets/wrappers/DashboardFormPage'

const AddJob = () => {
    const {
        isEditing,
        showAlert,
        displayAlert,
        position,
        company,
        jobLocation,
        jobType,
        jobTypeOptions,
        status,
        statusOptions,
        clearValues
    } = useAppContext()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!position || !company || !jobLocation) {
            displayAlert()
            return
        }
        console.log('create job')
    }

    const handleJobInput = (e) => {
        const name = e.target.name
        const value = e.target.value
        console.log(`${name}:${value}`)
    }

    return (
        <Wrapper>
            <form className='form'>
                <h3>{isEditing ? 'edit job' : 'add job'}</h3>
                {showAlert && <Alert />}

                <div className='form-center'>
                    <FormRow type='text' name='position' value={position} handleChange={handleJobInput} />

                    <FormRow type='text' labelText='company' name='jobLocation' value={jobLocation} handleChange={handleJobInput}
                    />

                    <FormRow type='text' labelText='location' name='jobLocation' vlaue={jobLocation} handleChange={handleJobInput} />

                    <FormRowSelect
                        name='status'
                        value={status}
                        handleChange={handleJobInput}
                        list={statusOptions}
                    />

                    <FormRowSelect
                        labelText='type'
                        name='jobType'
                        value={jobType}
                        handleChange={handleJobInput}
                        list={jobTypeOptions}
                    />
                </div>
                <div className='btn-container'>
                    <button className='btn btn-block submit-btn' type='submit' onClick={handleSubmit}>submit</button>
                </div>
                <div className='btn-container'>
                    <button
                        className='btn btn-block clear-btn'
                        onClick={(e) => {
                            e.preventDefault()
                            clearValues()
                        }}
                    >
                        clear
                    </button>
                </div>
            </form>
        </Wrapper>
    )
}

export default AddJob