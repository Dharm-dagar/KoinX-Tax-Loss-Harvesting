import { ThemeProvider } from './context/ThemeContext';
import { TaxProvider } from './context/TaxContext';
import Header from './components/Header/Header';
import TaxHarvesting from './pages/TaxHarvesting';

export default function App() {
  return (
    <ThemeProvider>
      <TaxProvider>
        <Header />
        <TaxHarvesting />
      </TaxProvider>
    </ThemeProvider>
  );
}
