import { useEffect } from 'react';
import TableMain from '../components/tablemain/TableMain';

const Home = () => {
  useEffect(() => {
    // Realizar scroll al inicio de la página cuando se cargue el componente
    window.scrollTo(0, -20);
  }, []); // El array vacío asegura que esto se ejecute solo una vez, cuando el componente se monta

  return (
    <div className="bg-gray-100 min-h-screen">
      <TableMain />
    </div>
  );
};

export default Home;