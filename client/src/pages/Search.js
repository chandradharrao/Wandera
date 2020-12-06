import React,{useState} from 'react'
import Result from "./Result";
import './Search.css';
import bgImg from '../images/Maps.jpg';
import Navbar from '../components/NavbarProf';

const Search = ()=>{

    const [searchTxt, setTxt] = useState("");

    const inptEvent = (event)=>{
        const data = event.target.value;
        setTxt(data);
    }
    const newStyle = {
        width: "100%",
        height: "700px",
        backgroundImage:`url(${bgImg})`
    };

    return(
        <div style = {newStyle}>
            <Navbar />
            <div className='search-component'>
                <h1 className = "heading">Search</h1>
                <div className = "searchbar">
                    <input type = 'text'
                    id = "searchbar-inner"
                    placeholder = "Search fellow wanderers..." 
                    value = {searchTxt}
                    onChange={inptEvent}/>
                </div>
            <div>
                <br></br>
                {searchTxt === '' ? null :<Result data = {searchTxt}/>}
            </div>
        </div>
        </div>
    )
}
export default Search;