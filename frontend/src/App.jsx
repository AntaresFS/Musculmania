// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    // La URL es relativa gracias al proxy de Vite
    fetch('/api/projects')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setMessage('');
      })
      .catch(error => {
        console.error("Error al obtener los proyectos:", error);
        setMessage('Error al conectar con el backend. ¿Está funcionando?');
      });
  }, []);

  return (
    <div className="App">
      <h1>Boilerplate Full Stack</h1>
      <h2>Proyectos desde el Backend:</h2>
      {message && <p>{message}</p>}
      <ul>
        {projects.map(project => (
          <li key={project.id}>
            <strong>{project.name}:</strong> {project.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;