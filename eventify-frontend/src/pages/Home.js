import React from 'react';
import { Link } from 'react-router-dom';
import bannerImage from '../assets/images/banner home.jpg';

function Home() {
  const isAuthenticated = !!localStorage.getItem('token'); // Verificar si el token existe

  return (
    <div className="home-page text-center py-5">
      <div className="container">
        <h1 className="display-4 text-primary">Bienvenido a Eventify</h1>
        <p className="lead text-secondary">
          Gestiona eventos de manera fácil y rápida. Regístrate, explora y participa en eventos.
        </p>
        <div className="my-4">
          {!isAuthenticated && (
            <>
              <Link to="/login" className="btn btn-primary btn-lg mx-2">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg mx-2">
                Regístrate
              </Link>
            </>
          )}
        </div>
        <img
          src={bannerImage}
          alt="Eventos destacados"
          className="img-fluid rounded shadow-lg my-4"
        />
        <div className="row mt-5">
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">Crea eventos</h5>
                <p className="card-text text-secondary">
                  Organiza tus propios eventos y compártelos con la comunidad.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">Descubre eventos</h5>
                <p className="card-text text-secondary">
                  Encuentra eventos interesantes y únete a ellos con un solo clic.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title text-primary">Mantente informado</h5>
                <p className="card-text text-secondary">
                  Recibe notificaciones y comentarios para estar siempre al día.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
