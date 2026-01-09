import { Route, Routes } from 'react-router-dom';

import Layout from '@/components/shared/layout';
import Auth from '@/pages/auth';
import Home from '@/pages/home';
import PrivacyPolicy from '@/pages/privacy-policy';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Route>
    </Routes>
  );
}

export default App;
