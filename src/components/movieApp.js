import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';

function  MovieApp() {

    const[movies,setMovies]=useState([]);
    const [searchQuery,setSearchQuery]=useState(" ");
    const [sortBy,setSortBy]=useState('popularity.desc')
    const [genres,setGenres]=useState([]);
    const [selectedGenre,setSelectedGenre]=useState('');
    const [expandedMovieId,setExapandedMovieId]=useState(null);

    useEffect(()=>{
        const fetchGenres=async()=>{
            const response=await axios.get(
               "https://api.themoviedb.org/3/genre/movie/list",
               {
                params:{
                    api_key: '8680ed4713dc170d5428e0ff944ff3cb',
                },
               }
            );
           setGenres(response.data.genres);
           console.log(response.data.genres); 
        }
        fetchGenres();
    },[]);

     useEffect(()=>{
        const fetchMovies=async()=>{
            const response=await axios.get(
               "https://api.themoviedb.org/3/discover/movie",
               {
                params:{
                    api_key: '8680ed4713dc170d5428e0ff944ff3cb',
                    sort_by:sortBy,
                    page:1,
                    with_genres:selectedGenre,
                    query:searchQuery,
                },
               }
            );
            setMovies(response.data.results);
        };
        fetchMovies(); 
     },[searchQuery, sortBy, selectedGenre]);

    const handleSearchonChange=(event)=>{
        setSearchQuery(event.target.value);
    }

    const handleSearchSubmit=async()=>{
        const response=await axios.get(
            "https://api.themoviedb.org/3/search/movie",
           {
            params:{
                api_key: '8680ed4713dc170d5428e0ff944ff3cb',
                query:searchQuery,
            },
           } 
        );
        setMovies(response.data.results);
    }

    const handleSortChange=(event)=>{
        setSortBy(event.target.value);
    }

   const handleGenreChange=(event)=>{
    setSelectedGenre(event.target.value);
   }
   
    const toggleDescripition=(movieId)=>{
        setExapandedMovieId(expandedMovieId===movieId ? null:movieId)
    }

  return (
    <div className='container'> 
        <h1>MovieHouse</h1>
        <div className='search-bar'>
            <input type='text' placeholder='search Movie...' value={searchQuery} onChange={handleSearchonChange} className='search-input' />
            <button className='search-button' onClick={handleSearchSubmit} ><AiOutlineSearch /></button>
        </div>
        <div className='filters'>
           
        <label htmlFor='sort-by'>Sort By:</label>
            <select id='sort-by' value={sortBy} onChange={handleSortChange}>
                <option value="popularity.desc">popularity Descending</option>
                <option value="popularity.asc">popularity Ascending</option>
                <option value="vote_average.desc">Rating Descending</option>
                <option value="vote_average.asc">Rating Ascending</option>
                <option value="release_date.desc">Release Date Descending</option>
                <option value="release_date.asc">Release Date Ascending</option>
            </select>
                <label htmlFor='genre'>Genre:</label>
           <select id='genre' value={selectedGenre} onChange={handleGenreChange}>
               <option value=" ">All Genres</option>
               {genres.map((genre)=>(
                    <option key={genre.id} value={genre.id}>{genre.name}</option> 
               ))}
            </select>
        </div>
        <div className='movie-wrapped '>
            {movies.map((movie)=>(
                <div key={movie.id} className='movie'>
                    <img src= {`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt='' />
                    <h2>{movie.title}</h2>
                    <p className='rating'>Rating:{movie.vote_average}</p>
                    {expandedMovieId === movie.id ? (
                        <p>{movie.review}</p>
                    ):(
                        <p>{movie.overview.substring(0, 105)}...</p>
                    )}
                     <button onClick={()=>
                        toggleDescripition(movie.id)} className='read-more'>
                            {expandedMovieId===movie.id ? 'show Less':'Read More'}

                     </button>
                    </div>
     
            ))}
            
        </div>
    </div>
  )
}

export default  MovieApp