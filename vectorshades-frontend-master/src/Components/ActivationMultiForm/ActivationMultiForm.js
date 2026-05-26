import { useState } from 'react'
import styles from './ActivationMultiForm.module.css'
import {FirstStep,SecondStep,ThirdStep,FourthStep} from './Steps'

const ActivationMultiForm = () => {

    const [stepIndex, setStepIndex] = useState(1)

    switch (stepIndex) {
        case 1: 
        return (
           <div className={styles.mf_main}>
            <FirstStep stepIndex={stepIndex} setStepIndex={setStepIndex} />
          </div> 
        )
        case 2: 
        return (
           <div className={styles.mf_main}>
            <SecondStep stepIndex={stepIndex} setStepIndex={setStepIndex} />
          </div>
        )
        case 3: 
        return (
           <div className={styles.mf_main}>
            <ThirdStep stepIndex={stepIndex} setStepIndex={setStepIndex} />
          </div>
        )
        case 4: 
        return (
           <div className={styles.mf_main}>
            <FourthStep stepIndex={stepIndex} setStepIndex={setStepIndex} />
          </div>
        )
        default: 
        //do nothing
    }

}

export default ActivationMultiForm
