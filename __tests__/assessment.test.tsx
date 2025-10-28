/*
  assessment.test.tsx
  - Tests basic UI navigation and assessment gating.
  - Comments explain what behavior each test ensures.
*/
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/index';

describe('Assessment flow', () => {
  test('home page loads and navigation to assessment works', () => {
    // Ensures the Home page renders and the "Take Assessment" button navigates to the assessment.
    render(<Home />);
    expect(screen.getByText(/SmartStart Investing/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/Take Assessment/i));
    expect(screen.getByText(/Risk Assessment/i)).toBeInTheDocument();
  });

  test('"Show My Results" disabled until all questions answered', () => {
    // Verifies the results button is disabled until user answers all questions.
    render(<Home />);
    fireEvent.click(screen.getByText(/Take Assessment/i));
    const btn = screen.getByText(/Show My Results/i);
    expect(btn).toBeDisabled();
  });
});