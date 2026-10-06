import { useState,useEffect } from 'react'
import { toast } from 'react-toastify'
import {getEmployeeTODOController,filterEmployeeTODOController} from '../../../src/Controllers/Employee/index'
import Body from '../../../src/Components/Bord/Bord'
import Head from '../../../src/Components/Bord/Head'
import Loader from "../../../src/Components/Loader/loader"
import styles from '../../../styles/TodoBoard.module.css'

const ToDOPage = () => {
  const [data, setdata] = useState([])
  const [LoadingPage, setLoadingPage] = useState(true)

  useEffect(() => {
    InitialLoad()
  }, [])

  const InitialLoad = () => {
    getEmployeeTODOController().then(({data}) => {
      const finalData = data.response.data
      setdata(finalData)
      setLoadingPage(false)
    }).catch((err) => {
      console.log(err)
      toast.error("error occurred while fetching")
    })
  }

  const filterToDoFunction = (string) => {
    filterEmployeeTODOController({filter:string}).then(({data}) => {
      const finalData = data.response.data.data
      setdata(finalData)
    })
  }

  if(LoadingPage) return <Loader/>
  
  else

  return (
    <section className={styles.page}>
      <Head filter={filterToDoFunction} render={InitialLoad}/>
      <Body data={data} render={InitialLoad}/>
    </section>
  )
}

export default ToDOPage