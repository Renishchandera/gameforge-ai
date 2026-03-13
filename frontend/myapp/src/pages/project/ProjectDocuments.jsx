import { Provider } from 'react-redux';
import { store } from '../../app/store';
import DocumentList from '../../components/documents/DocumentList';

export default function ProjectDocuments() {
  return (
    <Provider store={store}>
      <div className="container mx-auto py-6">
        <DocumentList />
      </div>
    </Provider>
  );
}