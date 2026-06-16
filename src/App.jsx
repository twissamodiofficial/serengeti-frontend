import { useState, useRef } from 'react';
import './App.css'
const API_URL = 'https://twissamodi-serengeti-classifier-api.hf.space/predict';

const SPECIES_LABELS = {
  blank: 'Empty frame',
  buffalo: 'Buffalo',
  elephant: 'Elephant',
  gazelleThomsons: "Thomson's gazelle",
  giraffe: 'Giraffe',
  guineaFowl: 'Guinea fowl',
  hippopotamus: 'Hippopotamus',
  hyenaSpotted: 'Spotted hyena',
  lionFemale: 'Lion (female)',
  wildebeest: 'Wildebeest',
  zebra: 'Zebra',
};

export default function App() {
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG or PNG).');
      return;
    }

    setError(null);
    setPredictions(null);
    setImagePreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('The classifier could not process this image.');
      }

      const data = await response.json();
      setPredictions(data.predictions);
    } catch (err) {
      setError('Could not reach the classifier. The model may be waking up from sleep — try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">Serengeti field classifier</h1>
          <p className="subtitle">CAMERA TRAP SPECIES ID &middot; RESNET18</p>
        </div>
        <span className="badge">11 CLASSES</span>
      </header>

      <main className="grid">
        <section className="upload-panel">
          <div
            className={`dropzone ${isDragging ? 'dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded specimen" className="preview-image" />
            ) : (
              <div className="dropzone-empty">
                <span className="dropzone-icon">&#128247;</span>
                <p className="dropzone-text">DROP SPECIMEN IMAGE OR CLICK TO UPLOAD</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="file-input"
            />
          </div>

          <p className="hint">
            Best results on camera-trap style photos — animals at a distance,
            natural outdoor settings. Close-up posed wildlife photography may
            not classify accurately.
          </p>
        </section>

        <section className="results-panel">
          <p className="results-label">FIELD LOG &mdash; TOP 3 MATCHES</p>

          {loading && (
            <p className="status-text">Reading specimen&hellip;</p>
          )}

          {error && (
            <p className="error-text">{error}</p>
          )}

          {!loading && !error && !predictions && (
            <p className="status-text muted">Upload an image to begin.</p>
          )}

          {predictions && (
            <div className="prediction-list">
              {predictions.map((pred, i) => (
                <div className="prediction-row" key={pred.species}>
                  <div className="prediction-header">
                    <span className={i === 0 ? 'species-name-top' : 'species-name'}>
                      {SPECIES_LABELS[pred.species] || pred.species}
                    </span>
                    <span className={i === 0 ? 'confidence-top' : 'confidence'}>
                      {pred.confidence.toFixed(1)}%
                    </span>
                  </div>
                  <div className="bar-track">
                    <div
                      className={i === 0 ? 'bar-fill-top' : 'bar-fill'}
                      style={{ width: `${pred.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        Trained on the{' '}
        <a href="https://lila.science/datasets/snapshot-serengeti" target="_blank" rel="noreferrer">
          Snapshot Serengeti
        </a>{' '}
        dataset &middot; 84% test accuracy across 11 classes &middot;{' '}
        <a href="https://github.com/twissamodi/serengeti" target="_blank" rel="noreferrer">
          read the full write-up
        </a>
      </footer>
    </div>
  );
}