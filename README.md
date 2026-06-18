# Serengeti Field Classifier — Frontend

A React frontend for the [Serengeti wildlife classifier API](https://github.com/twissamodi/serengeti-classifier-api) — upload a camera trap image, get back a species
prediction with confidence, and see exactly where in the image the model
looked to make that call.

**Live:** [serengeti-frontend.vercel.app](https://serengeti-frontend.vercel.app)

Part of a larger project covering the full pipeline from raw dataset to
deployed system:
[training repo](https://github.com/twissamodi/serengeti) ·
[backend repo](https://github.com/twissamodi/serengeti-classifier-api)

## What it does

- Upload or drag-and-drop a wildlife image
- Calls the deployed FastAPI backend's `/predict` endpoint
- Displays the top-3 predicted species with confidence bars
- Toggles between the original image and a GradCAM attention-map overlay,
  showing which regions of the image the model actually used to make its
  prediction
- Sets honest expectations up front: the model is trained on camera-trap
  style imagery and is explicit about working best on that kind of photo

## Design

Styled around the subject rather than a generic dashboard look — an earthy,
field-notebook palette and a "field log" readout for predictions instead of
plain progress bars, since this is a wildlife identification tool, not a
SaaS product.

## Stack

React (Vite) · plain CSS · deployed on Vercel

## Running locally

```bash
npm install
npm run dev
```

Update the `API_URL` constant at the top of `src/App.jsx` if pointing at a
different backend deployment than the default.

## Build & deploy

```bash
npm run build
```

Connected to Vercel for automatic deployment on push to `main`.