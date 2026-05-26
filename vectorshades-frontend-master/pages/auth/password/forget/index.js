import ResetPassword from '../../../../src/Components/Auth/ResetPassword';
import SetPassword from '../../../../src/Components/Auth/SetPassword';
import 'react-toastify/dist/ReactToastify.css';

const Index = () => {

  return (
    <section className='auth_container'>
      <section className='left_section'></section>
      <section className='right_section'>
        <ResetPassword/>
      </section>
    </section>
  )
}

export default Index