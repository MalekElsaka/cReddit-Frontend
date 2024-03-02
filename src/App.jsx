import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Navbar from './Components/Navbar';
import Sidebar from './Components/sidebar/Sidebar';
import Share from './Components/sidebar/Post/Share';
import Comment from './Components/sidebar/Post/Comment';
import Vote from './Components/sidebar/Post/Vote';

function App() {


  return (

    <div className="App h-screen flex flex-col bg-reddit_greenyDark">
      <div className='top-0 w-full inline-flex z-50'><Navbar /></div>
      <div className="w-full inline-flex flex-row justify-start content-center">
        <Sidebar />
        <span className='relative inline-flex mt-12 items-center cursor-pointer'><Share /></span>
        <span className='relative inline-flex mt-12 items-center cursor-pointer'><Comment /></span>
        <span className='relative inline-flex mt-12 items-center cursor-pointer'><Vote /></span>

      </div >
    </div>


  )
}

export default App
