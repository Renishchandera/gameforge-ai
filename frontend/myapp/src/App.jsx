import './App.css'
import { Outlet } from 'react-router'

function App({children}) {

  return (
    <>
      <h1 className='text-red-900'>GameForge AI</h1>
      <Outlet>{children}</Outlet>
    </>
  );
}

export default App
