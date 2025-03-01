import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    --primary-color: #4a6bfd;
    --secondary-color: #26de81;
    --background-color: #f7f9fc;
    --text-color: #333;
    --error-color: #ff6b6b;
    --success-color: #1dd1a1;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --border-radius: 8px;
    --transition: all 0.3s ease;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--background-color);
    color: var(--text-color);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
    border: none;
    background: var(--primary-color);
    color: white;
    padding: 0.8rem 1.5rem;
    border-radius: var(--border-radius);
    font-weight: 600;
    transition: var(--transition);

    &:hover {
      opacity: 0.9;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius);
    margin-bottom: 1rem;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  .card {
    background: white;
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
  }

  .btn-success {
    background: var(--success-color);
  }

  .btn-error {
    background: var(--error-color);
  }

  .btn-secondary {
    background: transparent;
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
  }
`;

export default GlobalStyles;