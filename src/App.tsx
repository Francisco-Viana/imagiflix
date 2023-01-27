import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { URL, APISTRING, EVENTS } from './data/contants'

import { Title } from './data/mock';

import Hero from './components/Hero';
import NavBar from './components/NavBar';
import Carousel from './components/Carousel';
import Footer from './components/Footer';

import { EventContext } from './context/eventContext';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Loading from './components/Loading';
import Modal from './components/Modal';

const App = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [series, setSeries] = useState<any[]>([]);
  const [upComing, setUpComing] = useState<any[]>([]);
  const [title, setTitle] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);

  const moviesUrl = `${URL}/discover/movie${APISTRING}&sort_by=popularity.desc`
  const seriesUrl = `${URL}/discover/tv${APISTRING}&sort_by=popularity.desc`
  const upComingUrl = `${URL}/movie/upcoming${APISTRING}&sort_by=popularity.desc`

  const getFeaturedMovie = () => movies && movies[0];

  const getMovieList = () => {
    if (movies) {
      const [...movieList] = movies;
      return movieList;
    }
    return [];
  };

  const getTitle = async ({ type, id }: Title) => {
    setLoading(true);
    const title = await axios.get(`${URL}/${type}/${id}${APISTRING}`)
    setTitle(title.data);
    setLoading(false);
  };

  const closeModal = () => setTitle(null)

  const dispatchEvent = (eventType: string, { type, id }: Title) =>{
    switch (eventType) {
      case EVENTS.PosterClick:
        getTitle({ type, id });
        break;
      case EVENTS.ModalClose:
        closeModal();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await axios.get(moviesUrl);
        setMovies(moviesData.data.results);

        const seriesData = await axios.get(seriesUrl)
        setSeries(seriesData.data.results)

        const upComingData = await axios.get(upComingUrl)
        setUpComing(upComingData.data.results)

        setLoading(false);
      } catch (error) {
        setMovies([])
        setSeries([])
        setUpComing([])
        setLoading(false);
      }
    }

    fetchData();
  }, [moviesUrl, seriesUrl, upComingUrl]);

  return (
    <div className='m-auto antialised font-sans bg-black text-white'>
      {loading
        ? 
          <>
            <Loading /> 
            <NavBar />
          </>
        : 
          <>
            <Hero {...getFeaturedMovie() } />
            <NavBar />
            <EventContext.Provider value={{ dispatchEvent }}>
              <Carousel title='Filmes Populares' data={getMovieList()}/>
              <Carousel title='Séries Populares' data={series}/>
              <Carousel title='Em breve...' data={upComing}/>
              {!loading && title && <Modal {...title} />}
            </EventContext.Provider>
          </>
      }
      <Footer />
    </div>
  );
};

export default App;
