import React from 'react';
import renderer from 'react-test-renderer';
import App from './App';

test('App Test', () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});