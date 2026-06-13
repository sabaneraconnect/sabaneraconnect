import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '60px' }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
