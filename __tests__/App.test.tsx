import 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import App from '../App';

test('renders correctly', () => {
  let tree;

  act(() => {
    tree = ReactTestRenderer.create(<App />);
  });

  expect(tree).toBeTruthy();
});

jest.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));
