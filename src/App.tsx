import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import Select from 'react-select';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import axios,  { AxiosRequestConfig } from 'axios';
import './App.css'; // Add basic styling here

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    language?: string;
    code?: string;
  }

function App() {
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState<'javascript' | 'python'>('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const languageExtensions = {
    javascript: javascript(),
    python: python(),
  };

  const selectOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
  ];

  const handleRunCode = async () => {
    setError('');
    setOutput('');
    try {
      const config: CustomAxiosRequestConfig = {
        params: {
            language: language,
            code: code,
        },
      };
      const response = await axios.get('/api/execute', config);
      const { status, output, error } = response.data[0].result[0];
      if (status === 'success') {
        setOutput(output);
      } else {
        setError(error);
      }
    } catch (err: unknown) {
        if (typeof err === 'string') {
            setError(err);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Unknown error occurred');
          }
    }
  };

  return (
    <div className="app">
      <h1>Add Two Numbers</h1>
      <div className="description">
        <p>You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.
           You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>
      </div>

      <div className="controls">
        <Select
          options={selectOptions}
          value={selectOptions.find(option => option.value === language)} // Set the value using the options
          onChange={(e) => setLanguage(e?.value as 'javascript' | 'python')}
          className="language-selector"
          styles={{ control: (base) => ({ ...base, width: '300px' }) }} // Inline styling for margin
          />

        <button onClick={handleRunCode} className="run-button">Run</button>
      </div>

      <CodeMirror
        value={code}
        height='400px'
        extensions={[languageExtensions[language]]}
        theme="dark"
        onChange={(value) => {
            setCode(value);
        }}
        className="code-editor"
      />

      <div className="output">
        <h2>Output:</h2>
        {error ? <p className="error">{error}</p> : <pre>{output}</pre>}
      </div>
    </div>
  );
}

export default App;