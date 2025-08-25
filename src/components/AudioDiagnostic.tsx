import React, { useState } from 'react';

export const AudioDiagnostic: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [isTesting, setIsTesting] = useState(false);

  const testAudioUrl = async (url: string, name: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        setTestResults(prev => ({ ...prev, [name]: '✅ Accessible' }));
      } else {
        setTestResults(prev => ({ ...prev, [name]: `❌ HTTP ${response.status}` }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [name]: `❌ Error: ${error}` }));
    }
  };

  const runTests = async () => {
    setIsTesting(true);
    setTestResults({});

    const testUrls = [
      {
        url: 'https://spanish-phrase-of-the-day.nyc3.cdn.digitaloceanspaces.com/mp3/mas-te-vale.mp3',
        name: 'Main Phrase Audio'
      },
      {
        url: 'https://spanish-phrase-of-the-day.nyc3.cdn.digitaloceanspaces.com/mp3/mas-te-vale-llegar-a-tiempo.mp3',
        name: 'Example 1 Audio'
      },
      {
        url: 'https://spanish-phrase-of-the-day.nyc3.cdn.digitaloceanspaces.com/mp3/mas-te-vale-no-mentirme.mp3',
        name: 'Example 2 Audio'
      },
      {
        url: 'https://spanish-phrase-of-the-day.nyc3.cdn.digitaloceanspaces.com/mp3/mas-te-vale-estudiar-para-el-examen.mp3',
        name: 'Example 3 Audio'
      }
    ];

    for (const test of testUrls) {
      await testAudioUrl(test.url, test.name);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsTesting(false);
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <strong>Audio Diagnostic</strong>
        <button
          onClick={runTests}
          disabled={isTesting}
          className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
        >
          {isTesting ? 'Testing...' : 'Test Audio'}
        </button>
      </div>
      
      <div className="space-y-1">
        {Object.entries(testResults).map(([name, result]) => (
          <div key={name} className="flex justify-between">
            <span>{name}:</span>
            <span>{result}</span>
          </div>
        ))}
      </div>
      
      {Object.keys(testResults).length === 0 && (
        <div className="text-gray-400">Click "Test Audio" to check accessibility</div>
      )}
    </div>
  );
};
