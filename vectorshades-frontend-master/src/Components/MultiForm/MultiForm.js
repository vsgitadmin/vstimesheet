import { createContext, useState, useEffect } from 'react'
import styles from './MultiForm.module.css'
import { FifthStep, FirstStep, FourthStep, SecondStep, SixthStep, ThirdStep } from './Steps'

const MultiForm = ({ dataDefault, submit, readOnly, empId, employeeDbId, section }) => {
  const [Data, setData] = useState({})
  const [stepIndex, setStepIndex] = useState(1)

  useEffect(() => {
    if (dataDefault) setData(dataDefault)
  }, [])

  useEffect(() => {
    if (section) setStepIndex(section)
  }, [section])


  const setDataFunction = (data, name) => {
    Data[name] = data
  }

  switch (stepIndex) {
    case 1:
      return (
        <div className={styles.mf_main}>
          <FirstStep stepIndex={stepIndex} section={section} key={Data} setStepIndex={setStepIndex} empId={empId} employeeDbId={employeeDbId} setData={setDataFunction} Data={Data} />
        </div>
      )
    case 2:
      return (
        <div className={styles.mf_main}>
          <SecondStep stepIndex={stepIndex} section={section} key={Data} setStepIndex={setStepIndex} empId={empId} setData={setDataFunction} Data={Data} />
        </div>
      )
    case 3:
      return (
        <div className={styles.mf_main}>
          <ThirdStep stepIndex={stepIndex} section={section} key={Data} setStepIndex={setStepIndex} empId={empId} setData={setDataFunction} Data={Data} />
        </div>
      )
    case 4:
      return (
        <div className={styles.mf_main}>
          <FourthStep stepIndex={stepIndex} section={section} key={Data} setStepIndex={setStepIndex} empId={empId} setData={setDataFunction} Data={Data} />
        </div>
      )
    case 5:
      return (
        <div className={styles.mf_main}>
          <FifthStep stepIndex={stepIndex} section={section} key={Data} setStepIndex={setStepIndex} empId={empId} setData={setDataFunction} Data={Data} />
        </div>
      )
    case 6:
      return (
        <div className={styles.mf_main}>
          <SixthStep stepIndex={stepIndex} section={section} key={Data} setStepIndex={setStepIndex} empId={empId} readOnly={readOnly} setData={setDataFunction} Data={Data} submit={() => submit(Data)} />
        </div>
      )
    default:
  }
}

export default MultiForm
