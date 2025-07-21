import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useCDI() {
  const [taxaCDI, setTaxaCDI] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCDI() {
      try {
        const res = await axios.get('/api/cdi');
        setTaxaCDI(res.data.taxaCDI);
      } catch (error) {
        console.error('Erro ao obter CDI:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCDI();
  }, []);

  return { taxaCDI, loading };
}
