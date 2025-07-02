# edX Google AI TensorFlow.js
This is a simple project demonstrating machine learning exercises from the edX course by Google on TensorFlow.js. You can demo it [here](https://tiepenatti.github.io/edx-google-ai-tensorflow/).

## Exercises

### 1. Smart Cam - Pre-trained models
![Using pre-trained models to classify images](/src/assets/images/smartcam.png)

Real-time object detection using your browser's camera. Uses the pre-trained [COCO-SSD model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) to identify objects in the video feed.

**Key Features:**
- Live camera feed with real-time object detection
- Privacy-focused (all processing happens locally)
- On/off toggle for object detection
- Clear visual boxes around detected objects with labels and confidence scores

### 2. House Price Predictor - Single-neuron model
![Single neuron NN to test linear regression on synthetic Real State data](/src/assets/images/realstate.png)

A simple neural network that predicts house prices based on floor size and number of bedrooms using synthetic real estate [data](https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/real-estate-data.js) from Google course.

**Key Features:**
- Single-neuron model demonstrating linear regression
- Interactive training configuration (learning rate, optimizer, etc.)
- Visual training progress with accuracy graphs
- Real-time price predictions based on user input

### 3. Digit Recognition - Deep learning / multi-layer model
![Simple NN to test handwritten digit classification from MNIST dataset](/src/assets/images/digit.png)
![Simple NN to test handwritten digit classification from MNIST dataset](/src/assets/images/digit2.png)

A neural network that recognizes hand-drawn digits using the [MNIST dataset](https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js) from Google course. Draw digits directly in your browser and see the model predict them in real-time.

**Key Features:**
- Draw digits using your mouse
- Customizable neural network architecture
- Live prediction with confidence scores
- Test with random samples from the training dataset
- Interactive drawing tools (adjustable brush size)

### 4. Fashion Item Classifier - Convolutional Neural Network
![Simple CNN to test image classification from MNIST dataset](/src/assets/images/fashion.png)
![Simple CNN to test image classification from MNIST dataset](/src/assets/images/fashion2.png)

A Convolutional Neural Network (CNN) that identifies clothing items from images using the [Fashion MNIST dataset](https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/fashion-mnist.js) from Google course.

**Key Features:**
- Drag-and-drop interface for testing your own images
- Image transformation controls (position, scale, rotation)
- Customizable CNN architecture
- Training progress visualization
- Top predictions with confidence scores

## Technical Stack

This project is built using modern web technologies:
- **React 19** - UI library for building component-based interfaces
- **TypeScript** - For type-safe JavaScript development
- **SASS/SCSS** - For enhanced CSS styling with modules support
- **Vite** - Next-generation frontend tooling for fast development and building
- **Material-UI** - React component library implementing Google's Material Design
- **TensorFlow.js** - Machine learning library for JavaScript
- **Chart.js** - For data visualization

## Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development
To start the development server with hot-reload:
```bash
npm run dev
```
This will:
- Start Vite dev server
- Watch for TypeScript compilation
- Compile SASS files automatically

The application will be available at `http://localhost:5173`

### Building for Production
To create a production build:
```bash
npm run build
```

### Preview Production Build
To preview the production build locally:
```bash
npm run preview
```

### Build and Deployment

This project uses a CI/CD pipeline powered by **GitHub Actions** to automate the build and deployment process. The pipeline is defined in `.github/workflows/githubpagesdeploy.yml` and includes the following steps:

1.  **Checkout**: Checks out the repository.
2.  **Setup Node.js**: Configures the Node.js environment.
3.  **Install Dependencies**: Installs project dependencies using `npm install`.
4.  **Build**: Builds the application for production using `npm run build`.
5.  **Deploy**: Deploys the build to GitHub Pages.

Additionally, a **Dockerfile** is included to create a consistent and reproducible build environment. This is particularly useful for debugging CI/CD issues locally.

To build the Docker image:

```bash
docker build -t edx-google-ai-tensorflow .
```

### Linting
To run the linter:
```bash
npm run lint
```
