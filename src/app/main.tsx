import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { AppProvider } from './provider/app.provider.tsx';

import './styles/index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<AppProvider />
		</StrictMode>,
	);
} else {
	console.error('Root element with id "root" not found.');
}
